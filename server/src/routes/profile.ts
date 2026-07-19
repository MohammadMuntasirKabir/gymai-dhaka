import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";

export const profileRouter = Router();

const VALID_GOALS = ["bulk", "cut", "recomp", "strength", "endurance"];
const VALID_EXPERIENCE = ["beginner", "intermediate", "advanced"];
const VALID_EQUIPMENT = ["full_gym", "home", "dumbbells"];
const VALID_SPLITS = ["full_body", "upper_lower", "ppl", "custom"];

interface ProfileRequestBody {
  userId: string;
  goal: string;
  experience: string;
  daysPerWeek: number;
  sessionLength: number;
  equipment: string;
  injuries?: string;
  preferredSplit: string;
}

function validateProfile(body: ProfileRequestBody): string | null {
  const { userId, goal, experience, daysPerWeek, sessionLength, equipment, preferredSplit } = body;

  if (typeof userId !== "string" || userId.length === 0 || userId.length > 100) return "User ID is required";
  if (!goal || !VALID_GOALS.includes(goal)) return `Invalid goal. Must be one of: ${VALID_GOALS.join(", ")}`;
  if (!experience || !VALID_EXPERIENCE.includes(experience)) return `Invalid experience. Must be one of: ${VALID_EXPERIENCE.join(", ")}`;
  if (typeof daysPerWeek !== "number" || daysPerWeek < 1 || daysPerWeek > 7) return "daysPerWeek must be between 1 and 7";
  if (typeof sessionLength !== "number" || sessionLength < 15 || sessionLength > 180) return "sessionLength must be between 15 and 180";
  if (!equipment || !VALID_EQUIPMENT.includes(equipment)) return `Invalid equipment. Must be one of: ${VALID_EQUIPMENT.join(", ")}`;
  if (!preferredSplit || !VALID_SPLITS.includes(preferredSplit)) return `Invalid split. Must be one of: ${VALID_SPLITS.join(", ")}`;
  if (body.injuries && body.injuries.length > 1000) return "Injuries note must be 1000 characters or fewer";

  return null;
}

profileRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as ProfileRequestBody;

    const validationError = validateProfile(body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { userId, goal, experience, daysPerWeek, sessionLength, injuries, preferredSplit } = body;

    await prisma.user_profiles.upsert({
      where: { user_id: userId },
      update: {
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment: body.equipment,
        health_concerns: injuries || null,
        split: preferredSplit,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment: body.equipment,
        health_concerns: injuries || null,
        split: preferredSplit,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("[profile] ERROR:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

profileRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profile = await prisma.user_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({
      userId: profile.user_id,
      goal: profile.goal,
      experience: profile.experience,
      daysPerWeek: profile.days_per_week,
      sessionLength: profile.session_length,
      equipment: profile.equipment,
      injuries: profile.health_concerns,
      preferredSplit: profile.split,
      updatedAt: profile.updated_at,
    });
  } catch (error) {
    console.error("[profile] ERROR:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
