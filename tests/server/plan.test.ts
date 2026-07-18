import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { planRouter } from "../../server/src/routes/plan";

// Mock Prisma
const { mockFindUnique, mockFindFirst, mockCreate, mockCount } = vi.hoisted(
  () => ({
    mockFindUnique: vi.fn(),
    mockFindFirst: vi.fn(),
    mockCreate: vi.fn(),
    mockCount: vi.fn(),
  }),
);

vi.mock("../../server/src/lib/prisma", () => ({
  prisma: {
    user_profiles: {
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
vi.mock("../../server/src/lib/ai", () => ({
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

type RouteHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type RouterLayer = {
  route?: { stack: Array<{ handle: RouteHandlerFn }> };
};

// Resolve the actual route handler from an Express 5 Router stack layer.
function getHandler(
  router: { stack: RouterLayer[] },
  layerIndex: number,
): RouteHandlerFn {
  const layer = router.stack[layerIndex];
  if (!layer?.route) {
    throw new Error(`Layer ${layerIndex} is not a route`);
  }
  return layer.route.stack[0].handle;
}

function createMockResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    query: {},
    params: {},
    ...overrides,
  } as unknown as Request;
}

describe("planRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /generate", () => {
    it("should generate a plan for valid userId with profile", async () => {
      mockFindUnique.mockResolvedValueOnce({
        user_id: "user-123",
        goal: "bulk",
        experience: "intermediate",
        days_per_week: 4,
        session_length: 60,
        equipment: "full_gym",
        health_concerns: null,
        split: "upper_lower",
      });
      mockFindFirst.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({
        id: "plan-1",
        version: 1,
        created_at: new Date("2024-01-01"),
      });

      const req = createMockRequest({
        body: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 50));

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { user_id: "user-123" },
      });
      expect(mockCreate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "plan-1",
          version: 1,
        }),
      );
    });

    it("should reject missing userId", async () => {
      const req = createMockRequest({ body: {} });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("User ID") }),
      );
    });

    it("should reject non-string userId", async () => {
      const req = createMockRequest({ body: { userId: 123 } });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject when profile not found", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      const req = createMockRequest({
        body: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("profile not found"),
        }),
      );
    });

    it("should increment version for subsequent plans", async () => {
      mockFindUnique.mockResolvedValueOnce({
        user_id: "user-123",
        goal: "bulk",
        experience: "intermediate",
        days_per_week: 4,
        session_length: 60,
        equipment: "full_gym",
        health_concerns: null,
        split: "upper_lower",
      });
      mockFindFirst.mockResolvedValueOnce({ version: 3 });
      mockCreate.mockResolvedValueOnce({
        id: "plan-4",
        version: 4,
        created_at: new Date("2024-01-01"),
      });

      const req = createMockRequest({
        body: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 50));

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ version: 4 }),
        }),
      );
    });

    it("should handle AI generation errors", async () => {
      // Reset the mock to throw
      const { generateTrainingPlan } = await import("../../server/src/lib/ai");
      vi.mocked(generateTrainingPlan).mockRejectedValueOnce(
        new Error("AI service unavailable"),
      );

      mockFindUnique.mockResolvedValueOnce({
        user_id: "user-123",
        goal: "bulk",
        experience: "intermediate",
        days_per_week: 4,
        session_length: 60,
        equipment: "full_gym",
        health_concerns: null,
        split: "upper_lower",
      });
      mockFindFirst.mockResolvedValueOnce(null);

      const req = createMockRequest({
        body: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 0)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 50));

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("Failed to generate"),
        }),
      );
    });
  });

  describe("GET /current", () => {
    it("should return the latest plan for a user", async () => {
      const mockPlan = {
        id: "plan-1",
        user_id: "user-123",
        plan_json: {
          overview: { goal: "bulk" },
          weeklySchedule: [],
          progression: "test",
        },
        plan_text: "{}",
        version: 1,
        created_at: new Date("2024-01-01"),
      };
      mockFindFirst.mockResolvedValueOnce(mockPlan);

      const req = createMockRequest({
        query: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 1)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { user_id: "user-123" },
        orderBy: { created_at: "desc" },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "plan-1",
          userId: "user-123",
          version: 1,
        }),
      );
    });

    it("should return 400 for missing userId", async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();

      await getHandler(planRouter, 1)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 when no plan exists", async () => {
      mockFindFirst.mockResolvedValueOnce(null);

      const req = createMockRequest({
        query: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 1)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("No plan") }),
      );
    });
  });

  describe("GET /exists", () => {
    it("should return exists: true when plans exist", async () => {
      mockCount.mockResolvedValueOnce(2);

      const req = createMockRequest({
        query: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 2)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(mockCount).toHaveBeenCalledWith({
        where: { user_id: "user-123" },
      });
      expect(res.json).toHaveBeenCalledWith({ exists: true });
    });

    it("should return exists: false when no plans exist", async () => {
      mockCount.mockResolvedValueOnce(0);

      const req = createMockRequest({
        query: { userId: "user-123" },
      });
      const res = createMockResponse();

      await getHandler(planRouter, 2)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.json).toHaveBeenCalledWith({ exists: false });
    });

    it("should return 400 for missing userId", async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();

      await getHandler(planRouter, 2)(req, res, (() => {}) as NextFunction);
      await new Promise((r) => setTimeout(r, 10));

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
