import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
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
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { PlanDisplay } from "../components/plan/PlanDisplay";
import { useState } from "react";

export default function Profile() {
  const { user, isLoading, isPlanLoading, plan, generatePlan } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

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

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleRegenerate() {
    setIsGenerating(true);
    setError("");
    try {
      await generatePlan();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate plan",
      );
    } finally {
      setIsGenerating(false);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
            <p className="text-muted">
              Version {plan.version} • Created {formatDate(plan.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              <RefreshCcw className="w-4 h-4" />
              Regenerate Plan
            </Button>
            <Button
              className="gap-2 px-5"
              onClick={() => navigate("/onboarding")}
            >
              <PenLine className="w-4 h-4" />
              Recreate Plan
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Goal</p>
              <p className="font-medium text-sm break-words">{plan.overview.goal}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Frequency</p>
              <p className="font-medium text-sm break-words">
                {plan.overview.frequency}
              </p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Split</p>
              <p className="font-medium text-sm break-words">{plan.overview.split}</p>
            </div>
          </Card>
          <Card variant="bordered" className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Version</p>
              <p className="font-medium text-sm break-words">{plan.version}</p>
            </div>
          </Card>
        </div>

        {/* Plan notes */}
        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
          <p className="text-muted text-sm leading-relaxed">
            {plan.overview.notes}
          </p>
        </Card>

        {/* Weekly Schedule */}
        <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>
        <PlanDisplay weeklySchedule={plan.weeklySchedule} />

        <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
          <p className="text-muted text-sm leading-relaxed">
            {plan.progression}
          </p>
        </Card>
      </div>
    </div>
  );
}
