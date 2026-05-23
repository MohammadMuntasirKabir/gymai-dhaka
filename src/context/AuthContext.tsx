import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrainingPlan, User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface NeonUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  plan: TrainingPlan | null;
  isLoading: boolean;
  isPlanLoading: boolean;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };
export type { AuthContextType };

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<NeonUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const isRefreshingRef = useRef(false);
  const lastSessionCheckRef = useRef(0);

  // Load session on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession();
        if (result && result.data?.user) {
          setNeonUser(result.data.user as NeonUser);
        } else {
          setNeonUser(null);
        }
      } catch {
        setNeonUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  // Re-check session when user might have just signed in
  useEffect(() => {
    if (isLoading) return;
    if (neonUser) return;

    const now = Date.now();
    if (now - lastSessionCheckRef.current < 2000) return;
    lastSessionCheckRef.current = now;

    let cancelled = false;
    async function recheckSession() {
      try {
        const result = await authClient.getSession();
        if (cancelled) return;
        if (result && result.data?.user) {
          setNeonUser(result.data.user as NeonUser);
        }
      } catch {
        // ignore
      }
    }
    recheckSession();
    return () => { cancelled = true; };
  }, [isLoading, neonUser]);

  // Fetch profile and plan when user is loaded
  useEffect(() => {
    if (isLoading) return;
    if (!neonUser?.id) {
      return;
    }

    const userId = neonUser.id;
    let cancelled = false;

    async function fetchProfile() {
      try {
        const profileData = await api.getProfile(userId);
        if (!cancelled && profileData) {
          setProfile(profileData);
        }
      } catch {
        if (!cancelled) setProfile(null);
      }
    }

    async function fetchPlan() {
      setIsPlanLoading(true);
      isRefreshingRef.current = true;
      try {
        const planData = await api.getCurrentPlan(userId);
        if (cancelled) return;
        if (planData) {
          setPlan({
            id: planData.id,
            userId: planData.userId,
            overview: planData.planJson.overview,
            weeklySchedule: planData.planJson.weeklySchedule,
            progression: planData.planJson.progression,
            version: planData.version,
            createdAt: planData.createdAt,
          });
        } else {
          setPlan(null);
        }
      } catch (err) {
        console.error("[AuthContext] fetchPlan error:", err instanceof Error ? err.message : err);
        if (!cancelled) setPlan(null);
      } finally {
        isRefreshingRef.current = false;
        if (!cancelled) setIsPlanLoading(false);
      }
    }

    fetchProfile();
    fetchPlan();
    return () => { cancelled = true; };
  }, [neonUser?.id, isLoading]);

  // Reset derived state when user signs out
  const prevUserIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const currentId = neonUser?.id;
    if (prevUserIdRef.current && !currentId) {
      setProfile(null);
      setPlan(null);
    }
    prevUserIdRef.current = currentId;
  }, [neonUser?.id]);

  const refreshData = useCallback(async () => {
    if (!neonUser?.id || isRefreshingRef.current) return;

    const userId = neonUser.id;
    isRefreshingRef.current = true;
    try {
      const [profileData, planData] = await Promise.all([
        api.getProfile(userId).catch(() => null),
        api.getCurrentPlan(userId).catch(() => null),
      ]);
      if (profileData) {
        setProfile(profileData);
      }
      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      } else {
        setPlan(null);
      }
    } catch {
      setPlan(null);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [neonUser]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save profile");
    }
    await api.saveProfile(neonUser.id, profileData);
    // Refresh to reflect saved data, but don't let a refresh failure
    // mask the successful save.
    try {
      await refreshData();
    } catch {
      // Profile saved on backend; refresh will happen on next navigation.
    }
  }

  async function generatePlan() {
    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan");
    }
    await api.generatePlan(neonUser.id);
    // Refresh data to fetch the newly created plan, but don't let
    // a refresh failure mask the successful generation.
    try {
      await refreshData();
    } catch {
      // Refresh failed but plan was generated. The profile page
      // will show loading state then empty state, and the user
      // can trigger a manual refresh.
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser as User | null,
        profile,
        plan,
        isLoading,
        isPlanLoading,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
