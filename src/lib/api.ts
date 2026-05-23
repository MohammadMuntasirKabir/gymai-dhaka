import type { UserProfile } from "../types";

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const errData = data as { error?: string; details?: string };
    throw new Error(errData.details || errData.error || "Request failed");
  }

  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const errData = data as { error?: string; details?: string };
    throw new Error(errData.details || errData.error || "Request failed");
  }

  return res.json() as Promise<T>;
}

export const api = {
  saveProfile: (
    userId: string,
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => {
    return post<void>("/profile", { userId, ...profile });
  },

  generatePlan: (userId: string) => {
    return post<void>("/plan/generate", { userId });
  },

  getCurrentPlan: (userId: string) => {
    return get<{
      id: string;
      userId: string;
      planJson: {
        overview: { goal: string; frequency: string; split: string; notes: string };
        weeklySchedule: Array<{
          day: string;
          focus: string;
          exercises: Array<{
            name: string;
            sets: number;
            reps: string;
            rest: string;
            rpe: number;
            notes?: string;
            alternatives?: string[];
          }>;
        }>;
        progression: string;
      };
      version: number;
      createdAt: string;
    }>(`/plan/current?userId=${userId}`);
  },

  getProfile: (userId: string) => {
    return get<UserProfile>(`/profile?userId=${userId}`);
  },

  hasAnyPlans: () => {
    return get<{ exists: boolean }>("/plan/exists");
  },
};
