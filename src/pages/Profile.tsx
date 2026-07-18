import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../components/ui/toastContext";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  Dumbbell,
  RefreshCcw,
  Target,
  TrendingUp,
  PenLine,
  Loader2,
  Plus,
  Check,
  Copy,
  Printer,
  History,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { PlanDisplay } from "../components/plan/PlanDisplay";
import { useState } from "react";
import type { TrainingPlan } from "../types";
import { api } from "../lib/api";
import { useWorkoutLog } from "../lib/workoutLog";
import {
  planToMarkdown,
  copyPlanAsMarkdown,
  printPlan,
} from "../lib/planExport";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ProgressRing({ percent }: { percent: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="var(--color-border)"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        stroke="var(--color-accent)"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        className="transition-all duration-500"
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        className="fill-foreground text-sm font-semibold"
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function Profile() {
  const { user, isLoading, isPlanLoading, plan, generatePlan } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Version history + viewer
  const [history, setHistory] = useState<
    Array<{ id: string; version: number; createdAt: string }>
  >([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [viewedPlan, setViewedPlan] = useState<TrainingPlan | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const totalDays = plan?.weeklySchedule.length ?? 0;
  const workout = useWorkoutLog(
    user?.id,
    plan?.version ?? 0,
    totalDays,
  );

  if (!user && !isLoading) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (isLoading || isPlanLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <Card variant="bordered" className="text-center py-16">
            <Loader2 className="w-12 h-12 text-accent mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Loading Your Plan</h1>
            <p className="text-muted">Fetching your training program...</p>
          </Card>
        </div>
      </div>
    );
  }

  // User is signed in but has no plan — show empty state instead of redirecting
  if (!plan) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <Card variant="bordered" className="text-center py-16">
            <Dumbbell className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">No Training Plan Yet</h1>
            <p className="text-muted mb-8">
              Create your personalized AI training plan to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/onboarding">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your Plan
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // When viewing a past version, render it instead of the latest.
  const display = viewedPlan ?? plan;

  async function handleRegenerate() {
    setIsGenerating(true);
    setError("");
    try {
      await generatePlan();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate plan");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    const ok = await copyPlanAsMarkdown(display);
    if (ok) success("Plan copied to clipboard as Markdown");
    else toastError("Could not copy plan — your browser blocked clipboard access");
  }

  function handlePrint() {
    printPlan(display);
  }

  async function loadHistory() {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const data = await api.getPlanHistory(user.id);
      setHistory(data.plans);
      setHistoryOpen(true);
    } catch {
      toastError("Could not load plan history");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function viewVersion(id: string) {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const data = await api.getPlanById(user.id, id);
      const viewed: TrainingPlan = {
        id: data.id,
        userId: data.userId,
        overview: data.planJson.overview,
        weeklySchedule: data.planJson.weeklySchedule,
        progression: data.planJson.progression,
        version: data.version,
        createdAt: data.createdAt,
      };
      setViewedPlan(viewed);
      setHistoryOpen(false);
    } catch {
      toastError("Could not load that version");
    } finally {
      setHistoryLoading(false);
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <Card variant="bordered" className="text-center py-16">
            <Loader2 className="w-12 h-12 text-accent mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Regenerating Your Plan</h1>
            <p className="text-muted">
              Our AI is building your new personalized training program...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {viewedPlan && (
          <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent flex-1">
              Viewing version {viewedPlan.version} ({formatDate(viewedPlan.createdAt)}) — read only
            </span>
            <Button variant="ghost" size="sm" onClick={() => setViewedPlan(null)}>
              Back to latest
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {viewedPlan ? "Past Plan Version" : "Your Training Plan"}
            </h1>
            <p className="text-muted">
              Version {display.version} • Created {formatDate(display.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!viewedPlan && (
              <>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={loadHistory}
                  disabled={historyLoading}
                >
                  <History className="w-4 h-4" />
                  History
                </Button>
                <Button
                  className="gap-2 px-5"
                  onClick={() => navigate("/onboarding")}
                >
                  <PenLine className="w-4 h-4" />
                  Recreate
                </Button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Version history drawer */}
        {historyOpen && (
          <Card variant="bordered" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Plan History</h2>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
                className="text-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted">No previous versions yet.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => viewVersion(h.id)}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-accent" />
                        <span className="font-medium text-sm">Version {h.version}</span>
                      </span>
                      <span className="text-xs text-muted">{formatDate(h.createdAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* Weekly progress (tracks the latest plan) */}
        {!viewedPlan && (
          <Card variant="bordered" className="mb-8">
            <div className="flex items-center gap-4">
              <ProgressRing percent={workout.percent} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">This Week's Progress</p>
                <p className="text-sm text-muted">
                  {workout.completedThisWeek} of {workout.totalDays} planned workout
                  {workout.totalDays === 1 ? "" : "s"} completed
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={workout.resetWeek}>
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-4">
              {workout.weekDates.map((iso, i) => {
                const done = workout.isDone(iso);
                const dayNum = Number(iso.slice(8));
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => workout.toggle(iso)}
                    aria-pressed={done}
                    aria-label={`${WEEKDAY_LABELS[i]} ${dayNum} ${done ? "completed" : "not completed"}`}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-colors ${
                      done
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "bg-background border-border text-muted hover:border-accent/40"
                    }`}
                  >
                    <span className="text-xs font-medium">{WEEKDAY_LABELS[i]}</span>
                    <span className="text-sm">{dayNum}</span>
                    {done && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Goal</p>
              <p className="font-medium text-sm break-words">{display.overview.goal}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Frequency</p>
              <p className="font-medium text-sm break-words">
                {display.overview.frequency}
              </p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Split</p>
              <p className="font-medium text-sm break-words">{display.overview.split}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Version</p>
              <p className="font-medium text-sm break-words">{display.version}</p>
            </div>
          </Card>
        </div>

        {/* Program notes */}
        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
          <p className="text-muted text-sm leading-relaxed">
            {display.overview.notes}
          </p>
        </Card>

        {/* Weekly Schedule */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">Weekly Schedule</h2>
          {!viewedPlan && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-2" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="secondary" size="sm" className="gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          )}
        </div>
        <PlanDisplay weeklySchedule={display.weeklySchedule} />

        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
          <p className="text-muted text-sm leading-relaxed">
            {display.progression}
          </p>
        </Card>

        {/* Fallback: copy raw markdown if browser blocks the rich buttons */}
        {!viewedPlan && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                void planToMarkdown(plan);
                handleCopy();
              }}
              className="text-xs text-muted underline hover:text-foreground transition-colors"
            >
              Copy plan as text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
