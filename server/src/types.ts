export interface UserProfile {
  goal: string;
  experience: string;
  days_per_week: number;
  session_length: number;
  equipment: string;
  health_concerns: string | null;
  split: string;
  userId?: string;
  updatedAt?: string;
}

export interface TrainingPlanExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number;
  notes?: string;
  alternatives?: string[];
}

export interface TrainingPlanDay {
  day: string;
  focus: string;
  exercises: TrainingPlanExercise[];
}

export interface TrainingPlan {
  id?: string;
  userId?: string;
  version?: number;
  createdAt?: string;
  overview: {
    goal: string;
    frequency: string;
    split: string;
    notes: string;
  };
  weeklySchedule: TrainingPlanDay[];
  progression: string;
}
