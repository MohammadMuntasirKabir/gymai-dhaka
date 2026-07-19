import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { generateTrainingPlan } from "../lib/ai.js";

export const planRouter = Router();

planRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (typeof userId !== "string" || userId.length === 0 || userId.length > 100) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profile = await prisma.user_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      return res
        .status(400)
        .json({ error: "User profile not found. Complete onboarding first." });
    }

    const latestPlan = await prisma.training_plans.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: { version: true },
    });

    const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

    const planJson = await generateTrainingPlan(profile);

    const planText = JSON.stringify(planJson, null, 2);

    const newPlan = await prisma.training_plans.create({
      data: {
        user_id: userId,
        plan_json: planJson as unknown as object,
        plan_text: planText,
        version: nextVersion,
      },
    });

    res.json({
      id: newPlan.id,
      version: newPlan.version,
      createdAt: newPlan.created_at,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[plan] Error generating plan:", message);
    res.status(500).json({
      error: "Failed to generate training plan. Please try again.",
    });
  }
});

planRouter.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    if (typeof userId !== "string" || userId.length === 0) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const plan = await prisma.training_plans.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    if (!plan) {
      return res.status(404).json({ error: "No plan found" });
    }

    res.json({
      id: plan.id,
      userId: plan.user_id,
      planJson: plan.plan_json,
      planText: plan.plan_text,
      version: plan.version,
      createdAt: plan.created_at,
    });
  } catch (error) {
    console.error("[plan] Error fetching plan:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to fetch plan" });
  }
});

planRouter.get("/history", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    if (typeof userId !== "string" || userId.length === 0) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const plans = await prisma.training_plans.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        version: true,
        created_at: true,
      },
    });

    res.json({
      plans: plans.map((p: { id: string; version: number; created_at: Date }) => ({
        id: p.id,
        version: p.version,
        createdAt: p.created_at,
      })),
    });
  } catch (error) {
    console.error("[plan] Error fetching history:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to fetch plan history" });
  }
});

planRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    if (typeof userId !== "string" || userId.length === 0) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (typeof id !== "string" || id.length === 0) {
      return res.status(400).json({ error: "Plan ID is required" });
    }

    const plan = await prisma.training_plans.findFirst({
      where: { id, user_id: userId },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json({
      id: plan.id,
      userId: plan.user_id,
      planJson: plan.plan_json,
      planText: plan.plan_text,
      version: plan.version,
      createdAt: plan.created_at,
    });
  } catch (error) {
    console.error("[plan] Error fetching plan by id:", error instanceof Error ? error.message : error);
    res.status(500).json({ error: "Failed to fetch plan" });
  }
});
