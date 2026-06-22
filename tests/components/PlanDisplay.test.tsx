import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanDisplay } from "../../src/components/plan/PlanDisplay";
import type { DaySchedule } from "../../src/types";

const mockSchedule: DaySchedule[] = [
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
      {
        name: "Barbell Row",
        sets: 3,
        reps: "10-12",
        rest: "60 sec",
        rpe: 7,
      },
    ],
  },
  {
    day: "Wednesday",
    focus: "Lower Body",
    exercises: [
      {
        name: "Squat",
        sets: 4,
        reps: "6-8",
        rest: "2-3 min",
        rpe: 9,
      },
    ],
  },
  {
    day: "Friday",
    focus: "Full Body",
    exercises: [],
  },
];

describe("PlanDisplay", () => {
  it("should render all days in the schedule", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
  });

  it("should render focus for each day", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("Upper Body")).toBeInTheDocument();
    expect(screen.getByText("Lower Body")).toBeInTheDocument();
    expect(screen.getByText("Full Body")).toBeInTheDocument();
  });

  it("should render exercise names", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Barbell Row")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
  });

  it("should render sets x reps", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    // Check that sets values and reps are rendered
    expect(screen.getAllByText("4").length).toBeGreaterThan(0);
    expect(screen.getByText(/8-12/)).toBeInTheDocument();
  });

  it("should render rest periods", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("90 sec")).toBeInTheDocument();
    expect(screen.getByText("60 sec")).toBeInTheDocument();
  });

  it("should render RPE values", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("should render exercise notes when present", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("Keep elbows tucked")).toBeInTheDocument();
  });

  it("should render exercise count for each day", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    expect(screen.getByText("2 exercises")).toBeInTheDocument();
    expect(screen.getByText("1 exercises")).toBeInTheDocument();
    expect(screen.getByText("0 exercises")).toBeInTheDocument();
  });

  it("should handle empty schedule", () => {
    const { container } = render(<PlanDisplay weeklySchedule={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("should render RPE with correct color classes", () => {
    render(<PlanDisplay weeklySchedule={mockSchedule} />);
    // RPE 9 should be red
    const rpe9 = screen.getByText("9");
    expect(rpe9.className).toContain("red");
    // RPE 7 should be yellow
    const rpe7 = screen.getByText("7");
    expect(rpe7.className).toContain("yellow");
  });
});
