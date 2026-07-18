import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "gym-ai:workouts";

function storageKey(userId: string, planVersion: number): string {
  return `${STORAGE_PREFIX}:${userId}:v${planVersion}`;
}

/** Returns the ISO date (yyyy-mm-dd) for a given Date in local time. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Monday-based start of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getCompletedDates(
  userId: string,
  planVersion: number,
): string[] {
  try {
    const raw = localStorage.getItem(storageKey(userId, planVersion));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveCompletedDates(
  userId: string,
  planVersion: number,
  dates: string[],
): void {
  localStorage.setItem(
    storageKey(userId, planVersion),
    JSON.stringify(dates),
  );
}

export interface WorkoutLog {
  completed: Set<string>;
  weekDates: string[];
  completedThisWeek: number;
  totalDays: number;
  percent: number;
  toggle: (dateISO: string) => void;
  isDone: (dateISO: string) => boolean;
  resetWeek: () => void;
}

/**
 * Tracks which workout days the user has completed for a given plan version.
 * Completion is stored per calendar day, and weekly progress is derived from
 * the current ISO week.
 */
export function useWorkoutLog(
  userId: string | undefined,
  planVersion: number,
  totalDays: number,
): WorkoutLog {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(userId ? getCompletedDates(userId, planVersion) : []),
  );

  useEffect(() => {
    const saved = userId ? getCompletedDates(userId, planVersion) : [];
    let cancelled = false;
    // Defer the state update to a microtask so the effect body itself
    // does not synchronously call setState (avoids cascading renders).
    void Promise.resolve().then(() => {
      if (!cancelled) setCompleted(new Set(saved));
    });
    return () => {
      cancelled = true;
    };
  }, [userId, planVersion]);

  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return toISODate(d);
  });

  const completedThisWeek = weekDates.filter((d) => completed.has(d)).length;
  const percent = totalDays > 0
    ? Math.min(100, Math.round((completedThisWeek / totalDays) * 100))
    : 0;

  const toggle = useCallback(
    (dateISO: string) => {
      if (!userId) return;
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(dateISO)) {
          next.delete(dateISO);
        } else {
          next.add(dateISO);
        }
        saveCompletedDates(
          userId,
          planVersion,
          Array.from(next),
        );
        return next;
      });
    },
    [userId, planVersion],
  );

  const isDone = useCallback(
    (dateISO: string) => completed.has(dateISO),
    [completed],
  );

  const resetWeek = useCallback(() => {
    if (!userId) return;
    const keep = getCompletedDates(userId, planVersion).filter(
      (d) => !weekDates.includes(d),
    );
    saveCompletedDates(userId, planVersion, keep);
    setCompleted(new Set(keep));
  }, [userId, planVersion, weekDates]);

  return {
    completed,
    weekDates,
    completedThisWeek,
    totalDays,
    percent,
    toggle,
    isDone,
    resetWeek,
  };
}
