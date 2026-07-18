import { describe, it, expect, beforeEach } from "vitest";
import {
  toISODate,
  startOfWeek,
  getCompletedDates,
} from "../../src/lib/workoutLog";

describe("toISODate", () => {
  it("should format a Date as yyyy-mm-dd in local time", () => {
    const d = new Date(2024, 0, 9, 15, 30); // Jan 9 2024, 3:30pm
    expect(toISODate(d)).toBe("2024-01-09");
  });

  it("should zero-pad month and day", () => {
    const d = new Date(2024, 8, 5); // Sep 5 2024
    expect(toISODate(d)).toBe("2024-09-05");
  });
});

describe("startOfWeek", () => {
  it("should return Monday of the given week", () => {
    // 2024-01-10 is a Wednesday; Monday is 2024-01-08
    const wednesday = new Date(2024, 0, 10, 12, 0);
    const monday = startOfWeek(wednesday);
    expect(toISODate(monday)).toBe("2024-01-08");
    expect(monday.getHours()).toBe(0);
  });

  it("should return the same day when given a Monday", () => {
    const monday = new Date(2024, 0, 8, 9, 0);
    expect(toISODate(startOfWeek(monday))).toBe("2024-01-08");
  });

  it("should wrap Sunday back to the same week's Monday", () => {
    // 2024-01-14 is a Sunday; its week starts 2024-01-08
    const sunday = new Date(2024, 0, 14);
    expect(toISODate(startOfWeek(sunday))).toBe("2024-01-08");
  });
});

describe("getCompletedDates", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return an empty array when nothing is stored", () => {
    expect(getCompletedDates("u1", 1)).toEqual([]);
  });

  it("should parse stored ISO dates", () => {
    localStorage.setItem(
      "gym-ai:workouts:u1:v1",
      JSON.stringify(["2024-01-08", "2024-01-09"]),
    );
    expect(getCompletedDates("u1", 1)).toEqual([
      "2024-01-08",
      "2024-01-09",
    ]);
  });

  it("should be resilient to malformed storage", () => {
    localStorage.setItem("gym-ai:workouts:u1:v1", "not json");
    expect(getCompletedDates("u1", 1)).toEqual([]);
  });
});
