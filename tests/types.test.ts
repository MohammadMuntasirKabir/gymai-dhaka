import { describe, it, expect } from "vitest";
import type {
  User,
  UserProfile,
  Exercise,
  DaySchedule,
  TrainingPlan,
  GymPartner,
  PricingTier,
} from "../src/types";

describe("Type interfaces", () => {
  describe("User", () => {
    it("should accept valid user object", () => {
      const user: User = {
        id: "123",
        email: "test@example.com",
        createdAt: "2024-01-01",
      };
      expect(user.id).toBe("123");
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("UserProfile", () => {
    it("should accept valid profile with all fields", () => {
      const profile: UserProfile = {
        userId: "123",
        goal: "bulk",
        experience: "intermediate",
        daysPerWeek: 4,
        sessionLength: 60,
        equipment: "full_gym",
        injuries: "lower back pain",
        preferredSplit: "upper_lower",
        updatedAt: "2024-01-01",
      };
      expect(profile.goal).toBe("bulk");
      expect(profile.daysPerWeek).toBe(4);
    });

    it("should accept profile without optional injuries field", () => {
      const profile: UserProfile = {
        userId: "123",
        goal: "cut",
        experience: "beginner",
        daysPerWeek: 3,
        sessionLength: 45,
        equipment: "home",
        preferredSplit: "full_body",
        updatedAt: "2024-01-01",
      };
      expect(profile.injuries).toBeUndefined();
    });

    it("should accept all valid goal values", () => {
      const goals: UserProfile["goal"][] = [
        "cut",
        "bulk",
        "recomp",
        "strength",
        "endurance",
      ];
      goals.forEach((goal) => {
        const profile: UserProfile = {
          userId: "123",
          goal,
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
          updatedAt: "2024-01-01",
        };
        expect(profile.goal).toBe(goal);
      });
    });

    it("should accept all valid experience values", () => {
      const experiences: UserProfile["experience"][] = [
        "beginner",
        "intermediate",
        "advanced",
      ];
      experiences.forEach((experience) => {
        const profile: UserProfile = {
          userId: "123",
          goal: "bulk",
          experience,
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: "upper_lower",
          updatedAt: "2024-01-01",
        };
        expect(profile.experience).toBe(experience);
      });
    });

    it("should accept all valid equipment values", () => {
      const equipment: UserProfile["equipment"][] = [
        "full_gym",
        "home",
        "dumbbells",
      ];
      equipment.forEach((eq) => {
        const profile: UserProfile = {
          userId: "123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: eq,
          preferredSplit: "upper_lower",
          updatedAt: "2024-01-01",
        };
        expect(profile.equipment).toBe(eq);
      });
    });

    it("should accept all valid split values", () => {
      const splits: UserProfile["preferredSplit"][] = [
        "full_body",
        "upper_lower",
        "ppl",
        "custom",
      ];
      splits.forEach((split) => {
        const profile: UserProfile = {
          userId: "123",
          goal: "bulk",
          experience: "intermediate",
          daysPerWeek: 4,
          sessionLength: 60,
          equipment: "full_gym",
          preferredSplit: split,
          updatedAt: "2024-01-01",
        };
        expect(profile.preferredSplit).toBe(split);
      });
    });
  });

  describe("Exercise", () => {
    it("should accept valid exercise with all fields", () => {
      const exercise: Exercise = {
        name: "Bench Press",
        sets: 4,
        reps: "8-12",
        rest: "90 sec",
        rpe: 8,
        notes: "Keep elbows tucked",
        alternatives: ["Dumbbell Press", "Push-ups"],
      };
      expect(exercise.name).toBe("Bench Press");
      expect(exercise.alternatives).toHaveLength(2);
    });

    it("should accept exercise without optional fields", () => {
      const exercise: Exercise = {
        name: "Squat",
        sets: 3,
        reps: "10-12",
        rest: "60 sec",
        rpe: 7,
      };
      expect(exercise.notes).toBeUndefined();
      expect(exercise.alternatives).toBeUndefined();
    });
  });

  describe("DaySchedule", () => {
    it("should accept valid day schedule", () => {
      const day: DaySchedule = {
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
      };
      expect(day.exercises).toHaveLength(1);
    });

    it("should accept empty exercises array", () => {
      const day: DaySchedule = {
        day: "Rest Day",
        focus: "Recovery",
        exercises: [],
      };
      expect(day.exercises).toHaveLength(0);
    });
  });

  describe("TrainingPlan", () => {
    it("should accept valid training plan", () => {
      const plan: TrainingPlan = {
        id: "plan-1",
        userId: "user-123",
        overview: {
          goal: "Build muscle",
          frequency: "4 days/week",
          split: "Upper/Lower",
          notes: "Focus on progressive overload",
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
        progression: "Add 2.5lbs when all sets completed",
        version: 1,
        createdAt: "2024-01-01",
      };
      expect(plan.version).toBe(1);
      expect(plan.weeklySchedule).toHaveLength(1);
    });
  });

  describe("GymPartner", () => {
    it("should accept valid gym partner", () => {
      const gym: GymPartner = {
        id: "gym-1",
        name: "Test Gym",
        area: "Test Area",
        address: "123 Test St",
        lat: 23.8103,
        lng: 90.4125,
        phone: "+880 1700-000000",
        hours: "6 AM - 10 PM",
        facilities: ["Cardio", "Weights"],
      };
      expect(gym.facilities).toContain("Cardio");
    });
  });

  describe("PricingTier", () => {
    it("should accept valid pricing tier", () => {
      const tier: PricingTier = {
        name: "Monthly",
        priceBDT: 3500,
        duration: "per month",
        features: ["All gyms", "All equipment"],
        popular: true,
      };
      expect(tier.popular).toBe(true);
    });

    it("should accept tier without popular flag", () => {
      const tier: PricingTier = {
        name: "Day Pass",
        priceBDT: 500,
        duration: "per day",
        features: ["One gym"],
      };
      expect(tier.popular).toBeUndefined();
    });
  });
});
