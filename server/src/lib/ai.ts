import OpenAI from "openai";
import { TrainingPlan, UserProfile } from "../types.js";

interface AiDaySchedule {
  day: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
    rpe: number;
    notes?: string;
    alternatives?: string[];
  }>;
}

interface AiPlanResponse {
  overview?: {
    goal?: string;
    frequency?: string;
    split?: string;
    notes?: string;
  };
  weeklySchedule?: AiDaySchedule[];
  progression?: string;
}

function stripMarkdown(content: string): string {
  return content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/g, "")
    .trim();
}

function tryParseJSON(text: string): unknown {
  const cleaned = stripMarkdown(text);
  return JSON.parse(cleaned);
}

export async function generateTrainingPlan(
  profile: UserProfile | Record<string, unknown>,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {
  const normalizedProfile: UserProfile = {
    goal: (profile as UserProfile).goal || "bulk",
    experience: (profile as UserProfile).experience || "intermediate",
    days_per_week: (profile as UserProfile).days_per_week || 4,
    session_length: (profile as UserProfile).session_length || 60,
    equipment: (profile as UserProfile).equipment || "full_gym",
    health_concerns:
      (profile as UserProfile).health_concerns ||
      ((profile as Record<string, unknown>).injuries as string) ||
      null,
    split:
      (profile as UserProfile).split ||
      ((profile as Record<string, unknown>).preferred_split as string) ||
      "upper_lower",
  };

  const apiKey = process.env.OPEN_ROUTER_KEY;

  if (!apiKey) {
    throw new Error("OPEN_ROUTER_KEY is not set in environment variables");
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.BASE_URL || "http://localhost:3001",
      "X-Title": "GymAI Plan Generator",
    },
    timeout: 120000,
  });

  const prompt = buildPrompt(normalizedProfile);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "qwen/qwen3-32b:free", // TEMP: verify pipeline; revert to google/gemma-4-31b-it:free
        messages: [
          {
            role: "system",
            content:
              "You are an expert fitness trainer and program designer. You must respond with valid JSON only. Do not include any markdown, reasoning, or additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("AI returned no response choices");
      }

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("No content in AI response");
      }

      try {
        const planData = tryParseJSON(content) as AiPlanResponse;
        return formatPlanResponse(planData, normalizedProfile);
      } catch {
        lastError = new Error("AI returned invalid JSON");
        if (attempt < 3) {
          continue;
        }
        throw lastError;
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Unknown AI error");

      // Don't retry on auth/rate-limit errors
      const msg = lastError.message.toLowerCase();
      if (
        msg.includes("401") ||
        msg.includes("403") ||
        msg.includes("unauthorized") ||
        msg.includes("rate limit") ||
        msg.includes("429")
      ) {
        break;
      }

      if (attempt < 3 && lastError.message !== "AI returned invalid JSON") {
        continue;
      }
      if (attempt >= 3) break;
    }
  }

  throw lastError || new Error("AI generation failed after 3 attempts");
}

function formatPlanResponse(
  aiResponse: AiPlanResponse,
  profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
  const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
    overview: {
      goal:
        aiResponse.overview?.goal ||
        `Customized ${profile.goal} program`,
      frequency:
        aiResponse.overview?.frequency ||
        `${profile.days_per_week} days per week`,
      split: aiResponse.overview?.split || profile.split,
      notes:
        aiResponse.overview?.notes ||
        "Follow the program consistently for best results.",
    },
    weeklySchedule: (aiResponse.weeklySchedule || []).map((day) => ({
      day: day.day || "Day",
      focus: day.focus || "Full Body",
      exercises: (day.exercises || []).map((ex) => ({
        name: ex.name || "Exercise",
        sets: ex.sets || 3,
        reps: ex.reps || "8-12",
        rest: ex.rest || "60-90 sec",
        rpe: ex.rpe || 7,
        notes: ex.notes,
        alternatives: ex.alternatives,
      })),
    })),
    progression:
      aiResponse.progression ||
      "Increase weight by 2.5-5lbs when you can complete all sets with good form. Track your progress weekly.",
  };
  return plan;
}

function buildPrompt(profile: UserProfile): string {
  const goalMap: Record<string, string> = {
    bulk: "build muscle and gain size",
    cut: "lose fat and maintain muscle",
    recomp: "simultaneously lose fat and build muscle",
    strength: "build maximum strength",
    endurance: "improve cardiovascular endurance and stamina",
  };

  const experienceMap: Record<string, string> = {
    beginner: "beginner (0-1 years of training experience)",
    intermediate: "intermediate (1-3 years of training experience)",
    advanced: "advanced (3+ years of training experience)",
  };

  const equipmentMap: Record<string, string> = {
    full_gym: "full gym access with all equipment",
    home: "home gym with limited equipment",
    dumbbells: "only dumbbells available",
  };

  const splitMap: Record<string, string> = {
    full_body: "full body workouts",
    upper_lower: "upper/lower split",
    ppl: "push/pull/legs split",
    custom: "best split for their goals",
  };

  return `Create a personalized ${profile.days_per_week}-day per week training plan for someone with the following profile:

Goal: ${goalMap[profile.goal] || profile.goal}
Experience Level: ${experienceMap[profile.experience] || profile.experience}
Session Length: ${profile.session_length} minutes per session
Equipment: ${equipmentMap[profile.equipment] || profile.equipment}
Preferred Split: ${splitMap[profile.split] || profile.split}
${profile.health_concerns ? `Injuries/Limitations: ${profile.health_concerns}` : ""}

Generate a complete training plan in JSON format with this exact structure:
{
  "overview": {
    "goal": "brief description of the training goal",
    "frequency": "X days per week",
    "split": "training split name",
    "notes": "important notes about the program (2-3 sentences)"
  },
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "muscle group or focus area",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 4,
          "reps": "6-8",
          "rest": "2-3 min",
          "rpe": 8,
          "notes": "form cues or tips (optional)",
          "alternatives": ["Alternative 1", "Alternative 2"]
        }
      ]
    }
  ],
  "progression": "detailed progression strategy (2-3 sentences explaining how to progress)"
}

Requirements:
- Create exactly ${profile.days_per_week} workout days
- Each workout should fit within ${profile.session_length} minutes
- Include 4-6 exercises per workout
- RPE (Rate of Perceived Exertion) should be 6-9
- Include compound movements for beginners/intermediate, advanced can have more isolation
- Match the preferred split type: ${profile.split}
- ${profile.health_concerns ? `Avoid exercises that could aggravate: ${profile.health_concerns}` : ""}
- Provide exercise alternatives where appropriate
- Make it progressive and suitable for ${experienceMap[profile.experience] || profile.experience} level

Return ONLY the JSON object (no markdown, no extra text).`;
}
