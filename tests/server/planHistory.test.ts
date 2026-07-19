import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { planRouter } from "../../server/src/routes/plan";

// Mock Prisma
const { mockFindUnique, mockFindFirst, mockFindMany, mockCreate } =
  vi.hoisted(() => ({
    mockFindUnique: vi.fn(),
    mockFindFirst: vi.fn(),
    mockFindMany: vi.fn(),
    mockCreate: vi.fn(),
  }));

vi.mock("../../server/src/lib/prisma", () => ({
  prisma: {
    user_profiles: {
      findUnique: mockFindUnique,
    },
    training_plans: {
      findFirst: mockFindFirst,
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

type RouteHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type RouterLayer = {
  route?: { stack: Array<{ handle: RouteHandlerFn }> };
};

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

describe("planRouter GET /history", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the list of plan versions", async () => {
    mockFindMany.mockResolvedValueOnce([
      { id: "p-2", version: 2, created_at: new Date("2024-02-01") },
      { id: "p-1", version: 1, created_at: new Date("2024-01-01") },
    ]);

    const req = createMockRequest({ query: { userId: "user-123" } });
    const res = createMockResponse();
    await getHandler(planRouter, 2)(req, res, (() => {}) as NextFunction);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { user_id: "user-123" },
      orderBy: { created_at: "desc" },
      select: { id: true, version: true, created_at: true },
    });
    expect(res.json).toHaveBeenCalledWith({
      plans: [
        { id: "p-2", version: 2, createdAt: expect.any(Date) },
        { id: "p-1", version: 1, createdAt: expect.any(Date) },
      ],
    });
  });

  it("should return 400 for missing userId", async () => {
    const req = createMockRequest({ query: {} });
    const res = createMockResponse();
    await getHandler(planRouter, 2)(req, res, (() => {}) as NextFunction);
    await new Promise((r) => setTimeout(r, 10));
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("planRouter GET /:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a specific plan by id", async () => {
    mockFindFirst.mockResolvedValueOnce({
      id: "p-2",
      user_id: "user-123",
      plan_json: { overview: { goal: "bulk" }, weeklySchedule: [], progression: "p" },
      plan_text: "{}",
      version: 2,
      created_at: new Date("2024-02-01"),
    });

    const req = createMockRequest({
      params: { id: "p-2" },
      query: { userId: "user-123" },
    });
    const res = createMockResponse();
    await getHandler(planRouter, 3)(req, res, (() => {}) as NextFunction);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "p-2", user_id: "user-123" },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: "p-2", version: 2, userId: "user-123" }),
    );
  });

  it("should return 400 when userId missing", async () => {
    const req = createMockRequest({ params: { id: "p-2" }, query: {} });
    const res = createMockResponse();
    await getHandler(planRouter, 3)(req, res, (() => {}) as NextFunction);
    await new Promise((r) => setTimeout(r, 10));
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 when plan not found", async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    const req = createMockRequest({
      params: { id: "p-x" },
      query: { userId: "user-123" },
    });
    const res = createMockResponse();
    await getHandler(planRouter, 3)(req, res, (() => {}) as NextFunction);
    await new Promise((r) => setTimeout(r, 10));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("not found") }),
    );
  });
});
