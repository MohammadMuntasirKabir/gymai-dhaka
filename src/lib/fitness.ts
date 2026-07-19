export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type Sex = "male" | "female";

export interface BmiResult {
  bmi: number;
  category: "underweight" | "normal" | "overweight" | "obese";
  label: string;
}

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little/no exercise)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very active (physical job / 2x/day)",
};

/** Height in cm, weight in kg. */
export function calculateBmi(
  weightKg: number,
  heightCm: number,
): BmiResult | null {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  if (!Number.isFinite(bmi)) return null;

  let category: BmiResult["category"];
  let label: string;
  if (bmi < 18.5) {
    category = "underweight";
    label = "Underweight";
  } else if (bmi < 25) {
    category = "normal";
    label = "Normal";
  } else if (bmi < 30) {
    category = "overweight";
    label = "Overweight";
  } else {
    category = "obese";
    label = "Obese";
  }

  return { bmi: Math.round(bmi * 10) / 10, category, label };
}

/** Mifflin-St Jeor BMR + activity multiplier. Weight kg, height cm, age years. */
export function calculateTdee(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
  activity: ActivityLevel,
): number | null {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return null;

  const base =
    10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  if (!Number.isFinite(base)) return null;

  return Math.round(base * ACTIVITY_FACTORS[activity]);
}
