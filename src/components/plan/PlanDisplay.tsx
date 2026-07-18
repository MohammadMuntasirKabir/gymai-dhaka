import { Dumbbell, Info } from "lucide-react";
import type { DaySchedule, Exercise } from "../../types";
import { Card } from "../ui/Card";

function ExerciseRow({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  return (
    <>
      <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4">
        <div className="flex items-start gap-3">
          <span className="text-xs text-muted w-5">{index + 1}.</span>
          <div>
            <p className="font-medium">{exercise.name}</p>
            {exercise.notes && (
              <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {exercise.notes}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="py-3 px-4 text-center whitespace-nowrap">
        <span className="text-accent font-medium">{exercise.sets}</span>
        <span className="text-muted"> x </span>
        <span>{exercise.reps}</span>
      </td>

      <td className="py-3 px-4 text-center">
        <span className="text-muted">{exercise.rest}</span>
      </td>
      <td className={`py-3 px-4 text-center`}>
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium
            ${
              exercise.rpe >= 8
                ? `bg-red-500/10 text-red-400`
                : exercise.rpe >= 7
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-green-500/10 text-green-400"
            }`}
        >
          {exercise.rpe}
        </span>
      </td>
      </tr>
      {exercise.alternatives && exercise.alternatives.length > 0 && (
      <tr className="border-b border-border last:border-0">
        <td colSpan={4} className="py-2 pr-4">
          <p className="text-xs text-muted flex items-center gap-1.5">
            <Info className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium text-muted/80">Alternatives:</span>
            {exercise.alternatives.join(" · ")}
          </p>
        </td>
      </tr>
      )}
    </>
  );
}

function DayCard({ schedule }: { schedule: DaySchedule }) {
  return (
    <Card variant="bordered" className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{schedule.day}</h3>
          <p className="text-sm text-accent">{schedule.focus}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Dumbbell className="w-4 h-4" />
          <span>{schedule.exercises.length} exercises</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-4 font-medium">Exercise</th>
              <th className="py-2 px-4 font-medium">Sets x Reps</th>
              <th className="py-2 px-4 font-medium">Rest</th>
              <th className="py-2 px-4 font-medium">RPE</th>
            </tr>
          </thead>

          <tbody>
            {schedule.exercises.map((exercise, idx) => (
              <ExerciseRow key={idx} exercise={exercise} index={idx} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface PlanDisplayProps {
  weeklySchedule: DaySchedule[];
  isLoading?: boolean;
}

export function PlanDisplay({ weeklySchedule, isLoading }: PlanDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 mb-8">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="animate-pulse rounded-lg bg-border h-5 w-24" />
                <div className="animate-pulse rounded-lg bg-border h-4 w-32" />
              </div>
              <div className="animate-pulse rounded-lg bg-border h-4 w-20" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="animate-pulse rounded-lg bg-border h-4 w-32" />
                  <div className="animate-pulse rounded-lg bg-border h-4 w-20 ml-auto" />
                  <div className="animate-pulse rounded-lg bg-border h-4 w-16" />
                  <div className="animate-pulse rounded-lg bg-border h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {weeklySchedule.map((schedule, idx) => (
        <DayCard key={idx} schedule={schedule} />
      ))}
    </div>
  );
}
