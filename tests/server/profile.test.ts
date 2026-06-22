import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma before importing routes
const mockUpsert = vi.fn();
const mockFindUnique = vi.fn();
const mockFindFirst = vi.fn();
const mockCreate = vi.fn();
const mockCount = vi.fn();

vi.mock("../server/src/lib/prisma", () => ({
  prisma: {
    user_profiles: {
      upsert: mockUpsert,
      findUnique: mockFindUnique,
    },
    training_plans: {
      findFirst: mockFindFirst,
      create: mockCreate,
      count: mockCount,
    },
  },
}));

// Mock the AI module
vi.mock("../server/src/lib/ai", () => ({
  generateTrainingPlan: vi.fn().mockResolvedValue({
    overview: {
      goal: "Build muscle",
      frequency: "4 days per week",
      split: "upper_lower",
      notes: "Test plan",
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
          },
        ],
      },
    ],
    progression: "Progressive overload",
  }),
}));

import { profileRouter } from "../../server/src/routes/profile";
import { planRouter } from "../../server/src/routes/plan";
import type { Request, Response, NextFunction } from "express";

function createMockResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    query: {},
    params: {},
    ...overrides,
  } as unknown as Request;
}

describe("profileRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /", () => {
    it("should save a valid profile", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);

      // The route uses async handler, so we need to wait for the promise
      await new Promise((r) => setTimeout(r, 10));

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: "user-123" },
          create: expect.objectContaining({
            user_id: "user-123",
            goal: "bulk",
            experience: "intermediate",
          }),
          update: expect.objectContaining({
            goal: "bulk",
            experience: "intermediate",
          }),
        }),
      );
    });

    it("should reject missing userId", async () => {
      const req = createMockRequest({
        body: {
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("User ID") }),
      );
    });

    it("should reject invalid goal", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "invalid_goal",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("goal") }),
      );
    });

    it("should reject invalid experience", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "expert",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("experience") }),
      );
    });

    it("should reject daysPerWeek out of range", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 0,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("daysPerWeek") }),
      );
    });

    it("should reject daysPerWeek > 7", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 8,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject sessionLength out of range", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 5,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("sessionLength") }),
      );
    });

    it("should reject invalid equipment", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "barbells_only",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("equipment") }),
      );
    });

    it("should reject invalid split", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "bro_split",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("split") }),
      );
    });

    it("should handle optional injuries field", async () => {
      const req = createMockRequest({
        body: {
          userId: "user-123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          injuries: "lower back pain",
          preferredSplit: "upper_lower",
        },
      });
      const res = createMockResponse();

      await profileRouter.stack[0].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            health_concerns: "lower back pain",
          }),
        }),
      );
    });
  });

  describe("GET /", () => {
    it("should return a profile for valid userId", async () => {
      mockFindUnique.mockResolvedValueOnce({
        user_id: "user-123",
        goal: "bulk",
        experience: "intermediate",
        days_per_week: 4,
        session_length: 60,
        equipment: "full_gym",
        health_concerns: null,
        split: "upper_lower",
        updated_at: new Date("2024-01-01"),
      });

      const req = createMockRequest({
        query: { userId: "user-123" },
      });
      const res = createMockResponse();

      await profileRouter.stack[1].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { user_id: "user-123" },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-123",
          goal: "bulk",
          daysPerWeek: 4,
        }),
      );
    });

    it("should return 400 for missing userId", async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();

      await profileRouter.stack[1].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("User ID") }),
      );
    });

    it("should return 404 for non-existent profile", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      const req = createMockRequest({
        query: { userId: "nonexistent" },
      });
      const res = createMockResponse();

      await profileRouter.stack[1].handle(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("not found") }),
      );
    });
  });
});
