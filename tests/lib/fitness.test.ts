import { describe, it, expect } from "vitest";
import {
  calculateBmi,
  calculateTdee,
  ACTIVITY_FACTORS,
} from "../../src/lib/fitness";
import { cn } from "../../src/lib/cn";

describe("fitness calculators", () => {
  it("calculates BMI and category", () => {
    const r = calculateBmi(70, 170);
    expect(r?.bmi).toBeCloseTo(24.2, 1);
    expect(r?.category).toBe("normal");
    expect(r?.label).toBe("Normal");
  });

  it("flags underweight and obese", () => {
    expect(calculateBmi(45, 170)?.category).toBe("underweight");
    expect(calculateBmi(95, 170)?.category).toBe("obese");
  });

  it("returns null for invalid input", () => {
    expect(calculateBmi(0, 170)).toBeNull();
    expect(calculateBmi(70, 0)).toBeNull();
  });

  it("computes TDEE via Mifflin-St Jeor * activity", () => {
    const tdee = calculateTdee(70, 170, 28, "male", "moderate");
    const expected = Math.round(
      (10 * 70 + 6.25 * 170 - 5 * 28 + 5) * ACTIVITY_FACTORS.moderate,
    );
    expect(tdee).toBe(expected);
  });

  it("returns null for invalid TDEE input", () => {
    expect(calculateTdee(0, 170, 28, "male", "moderate")).toBeNull();
    expect(calculateTdee(70, 170, 0, "male", "moderate")).toBeNull();
  });
});

describe("cn", () => {
  it("merges classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind classes (later wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-red-500", "bg-accent")).toBe("bg-accent");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
