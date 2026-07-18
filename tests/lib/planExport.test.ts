import { describe, it, expect } from "vitest";
import { planToMarkdown, copyPlanAsMarkdown } from "../../src/lib/planExport";
import type { TrainingPlan } from "../../src/types";

const mockPlan: TrainingPlan = {
  id: "plan-1",
  userId: "user-123",
  overview: {
    goal: "Build muscle",
    frequency: "4 days per week",
    split: "Upper/Lower",
    notes: "Focus on progressive overload.",
  },
  weeklySchedule: [
    {
      day: "Monday",
      focus: "Upper Body",
      exercises: [
        {
          name: "Bench Press",
          sets: 4,
          reps: "8-12",
          rest: "90 sec",
          rpe: 8,
          notes: "Keep elbows tucked",
          alternatives: ["Dumbbell Press", "Push-ups"],
        },
      ],
    },
    {
      day: "Rest",
      focus: "Recovery",
      exercises: [],
    },
  ],
  progression: "Add 2.5lbs when all sets completed.",
  version: 2,
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("planToMarkdown", () => {
  it("should include the goal, split and version", () => {
    const md = planToMarkdown(mockPlan);
    expect(md).toContain("# GymAI Dhaka — Training Plan");
    expect(md).toContain("Build muscle");
    expect(md).toContain("Version:** 2");
    expect(md).toContain("Monday");
    expect(md).toContain("Rest / active recovery");
  });

  it("should render alternatives in the table", () => {
    const md = planToMarkdown(mockPlan);
    expect(md).toContain("Alt: Dumbbell Press, Push-ups");
  });

  it("should render progression strategy", () => {
    const md = planToMarkdown(mockPlan);
    expect(md).toContain("Add 2.5lbs when all sets completed.");
  });
});

describe("copyPlanAsMarkdown", () => {
  it("should write Markdown to the clipboard", async () => {
    let captured = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          captured = text;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    const ok = await copyPlanAsMarkdown(mockPlan);
    expect(ok).toBe(true);
    expect(captured).toContain("GymAI Dhaka");
  });

  it("should fall back gracefully when clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const ok = await copyPlanAsMarkdown(mockPlan);
    // No clipboard and no execCommand in jsdom -> false, no throw
    expect(ok).toBe(false);
  });
});
