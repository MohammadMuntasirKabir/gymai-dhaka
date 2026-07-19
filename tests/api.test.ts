import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "../src/lib/api";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("saveProfile", () => {
    it("should POST to /api/profile with userId and profile data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await api.saveProfile("user-123", {
        goal: "bulk",
        experience: "intermediate",
        daysPerWeek: 4,
        sessionLength: 60,
        equipment: "full_gym",
        preferredSplit: "upper_lower",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/profile",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: expect.stringContaining("user-123"),
        }),
      );
    });

    it("should throw on error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Bad request" }),
      });

      await expect(
        api.saveProfile("user-123", {
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
        }),
      ).rejects.toThrow("Bad request");
    });
  });

  describe("generatePlan", () => {
    it("should POST to /api/plan/generate with userId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "plan-1", version: 1 }),
      });

      await api.generatePlan("user-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/plan/generate",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ userId: "user-123" }),
        }),
      );
    });

    it("should throw on error with details", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ details: "Profile not found" }),
      });

      await expect(api.generatePlan("user-123")).rejects.toThrow(
        "Profile not found",
      );
    });
  });

  describe("getCurrentPlan", () => {
    it("should GET /api/plan/current with userId", async () => {
      const mockPlan = {
        id: "plan-1",
        userId: "user-123",
        planJson: {
          overview: {
            goal: "bulk",
            frequency: "4 days/week",
            split: "upper_lower",
            notes: "Test",
          },
          weeklySchedule: [],
          progression: "Progress",
        },
        version: 1,
        createdAt: "2024-01-01",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlan,
      });

      const result = await api.getCurrentPlan("user-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/plan/current?userId=user-123",
        expect.objectContaining({
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockPlan);
    });

    it("should throw on error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Not found" }),
      });

      await expect(api.getCurrentPlan("user-123")).rejects.toThrow(
        "Not found",
      );
    });
  });

  describe("getProfile", () => {
    it("should GET /api/profile with userId", async () => {
      const mockProfile = {
        userId: "user-123",
        goal: "bulk",
        experience: "intermediate",
        daysPerWeek: 4,
        sessionLength: 60,
        equipment: "full_gym",
        preferredSplit: "upper_lower",
        updatedAt: "2024-01-01",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      const result = await api.getProfile("user-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/profile?userId=user-123",
        expect.objectContaining({
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockProfile);
    });
  });

  describe("error handling", () => {
    it("should handle non-JSON error responses gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(api.getCurrentPlan("user-1")).rejects.toThrow(
        "Request failed",
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(api.getCurrentPlan("user-1")).rejects.toThrow(
        "Network error",
      );
    });
  });
});
