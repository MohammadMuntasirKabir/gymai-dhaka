import { RedirectToSignIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/useAuth";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useState } from "react";
import { Textarea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import type { UserProfile } from "../types";
import { useNavigate } from "react-router-dom";

const goalOptions = [
  { value: "bulk", label: "Build Muscle (Bulk)" },
  { value: "cut", label: "Lose Fat (Cut)" },
  { value: "recomp", label: "Body Recomposition" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
];

const experienceOptions = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

const daysOptions = [
  { value: "2", label: "2 days per week" },
  { value: "3", label: "3 days per week" },
  { value: "4", label: "4 days per week" },
  { value: "5", label: "5 days per week" },
  { value: "6", label: "6 days per week" },
];

const sessionOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

const equipmentOptions = [
  { value: "full_gym", label: "Full Gym Access" },
  { value: "home", label: "Home Gym" },
  { value: "dumbbells", label: "Dumbbells Only" },
];

const splitOptions = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper/Lower Split" },
  { value: "ppl", label: "Push/Pull/Legs" },
  { value: "custom", label: "Let AI Decide" },
];

const defaultFormData = {
  goal: "bulk",
  experience: "intermediate",
  daysPerWeek: "4",
  sessionLength: "60",
  equipment: "full_gym",
  injuries: "",
  preferredSplit: "upper_lower",
};

interface FormErrors {
  daysPerWeek?: string;
  sessionLength?: string;
  injuries?: string;
}

function validateForm(data: typeof defaultFormData): FormErrors {
  const errors: FormErrors = {};

  const days = parseInt(data.daysPerWeek);
  if (isNaN(days) || days < 1 || days > 7) {
    errors.daysPerWeek = "Please select between 1 and 7 days per week.";
  }

  const session = parseInt(data.sessionLength);
  if (isNaN(session) || session < 15 || session > 180) {
    errors.sessionLength = "Session length must be between 15 and 180 minutes.";
  }

  if (data.injuries && data.injuries.length > 500) {
    errors.injuries = "Please keep injury/limitation notes under 500 characters.";
  }

  return errors;
}

function profileToFormData(profile: UserProfile | null) {
  if (!profile) return defaultFormData;
  return {
    goal: profile.goal,
    experience: profile.experience,
    daysPerWeek: String(profile.daysPerWeek),
    sessionLength: String(profile.sessionLength),
    equipment: profile.equipment,
    injuries: profile.injuries || "",
    preferredSplit: profile.preferredSplit,
  };
}

export default function Onboarding() {
  const { user, profile, saveProfile, generatePlan } = useAuth();
  const [formData, setFormData] = useState(() => profileToFormData(profile));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  function updateForm(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validateForm(formData);
    if (errors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: errors[field as keyof FormErrors] }));
    }
  }

  async function handleQuestionnaire(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate all fields before submitting
    const errors = validateForm(formData);
    setFormErrors(errors);
    setTouched({ daysPerWeek: true, sessionLength: true, injuries: true });
    if (Object.keys(errors).length > 0) {
      return;
    }

    const profileData: Omit<UserProfile, "userId" | "updatedAt"> = {
      goal: formData.goal as UserProfile["goal"],
      experience: formData.experience as UserProfile["experience"],
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionLength: parseInt(formData.sessionLength),
      equipment: formData.equipment as UserProfile["equipment"],
      injuries: formData.injuries || undefined,
      preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
    };

    // Step 1: Save profile
    try {
      setError("");
      await saveProfile(profileData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save your preferences. Please try again.",
      );
      return;
    }

    // Step 2: Generate plan
    try {
      setIsGenerating(true);
      await generatePlan();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Profile saved, but plan generation failed: ${err.message}. You can regenerate from your profile page.`
          : "Profile saved, but plan generation failed. You can regenerate from your profile page.",
      );
      setIsGenerating(false);
      return;
    }

    // Step 3: Navigate to profile
    navigate("/profile");
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-xl mx-auto">
        {!isGenerating ? (
          <Card variant="bordered">
            <h1 className="text-2xl font-bold mb-2">
              {profile ? "Update Your Preferences" : "Tell Us About Yourself"}
            </h1>
            <p className="text-muted mb-6">
              {profile
                ? "Adjust your fitness profile and generate a new plan."
                : "Help us create the perfect plan for you. This only takes a minute."}
            </p>
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <form onSubmit={handleQuestionnaire} className="space-y-5">
              <Select
                id="goal"
                label="What's your primary goal?"
                options={goalOptions}
                value={formData.goal}
                onChange={(e) => updateForm("goal", e.target.value)}
              />
              <Select
                id="experience"
                label="Training experience"
                options={experienceOptions}
                value={formData.experience}
                onChange={(e) => updateForm("experience", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="daysPerWeek"
                  label="Days per week"
                  options={daysOptions}
                  value={formData.daysPerWeek}
                  onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                  onBlur={() => handleBlur("daysPerWeek")}
                  error={touched.daysPerWeek ? formErrors.daysPerWeek : undefined}
                />
                <Select
                  id="sessionLength"
                  label="Session length"
                  options={sessionOptions}
                  value={formData.sessionLength}
                  onChange={(e) =>
                    updateForm("sessionLength", e.target.value)
                  }
                  onBlur={() => handleBlur("sessionLength")}
                  error={touched.sessionLength ? formErrors.sessionLength : undefined}
                />
              </div>
              <Select
                id="equipment"
                label="Equipment access"
                options={equipmentOptions}
                value={formData.equipment}
                onChange={(e) => updateForm("equipment", e.target.value)}
              />

              <Select
                id="preferredSplit"
                label="Preferred training split"
                options={splitOptions}
                value={formData.preferredSplit}
                onChange={(e) => updateForm("preferredSplit", e.target.value)}
              />

              <Textarea
                id="injuries"
                label="Any injuries or limitations? (optional)"
                placeholder="E.g., lower back issues, shoulder impingement..."
                rows={3}
                value={formData.injuries}
                onChange={(e) => updateForm("injuries", e.target.value)}
                onBlur={() => handleBlur("injuries")}
                error={touched.injuries ? formErrors.injuries : undefined}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 gap-2">
                  {profile ? "Update & Generate" : "Generate My Plan"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card variant="bordered" className="text-center py-16">
            <Loader2 className="w-12 h-12 text-accent mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Creating Your Plan</h1>
            <p className="text-muted">
              Our AI is building your personalized training program...
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
