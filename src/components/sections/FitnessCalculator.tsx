import { useState } from "react";
import { Calculator, HeartPulse, Flame } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  calculateBmi,
  calculateTdee,
  ACTIVITY_LABELS,
  type ActivityLevel,
  type Sex,
} from "../../lib/fitness";

const BMI_COLORS: Record<string, string> = {
  underweight: "text-sky-400",
  normal: "text-accent",
  overweight: "text-yellow-400",
  obese: "text-red-400",
};

export default function FitnessCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [age, setAge] = useState("28");
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const bmi = calculateBmi(Number(weight), Number(height));
  const tdee =
    bmi && Number(weight) > 0 && Number(height) > 0 && Number(age) > 0
      ? calculateTdee(Number(weight), Number(height), Number(age), sex, activity)
      : null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4">
            <Calculator className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">Free fitness tools</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Know Your <span className="text-accent">Numbers</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Estimate your BMI and daily calorie needs in seconds. Use these as a
            baseline — your AI plan adapts to your real progress.
          </p>
        </div>

        <Card variant="bordered" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-accent" /> Your details
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Weight (kg)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                    aria-label="Weight in kilograms"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Height (cm)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                    aria-label="Height in centimeters"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted">Age</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                    aria-label="Age in years"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                {(["male", "female"] as Sex[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    aria-pressed={sex === s}
                    className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                      sex === s
                        ? "bg-accent text-black border-accent"
                        : "bg-background border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">Activity level</span>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent"
                >
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((k) => (
                    <option key={k} value={k}>
                      {ACTIVITY_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" /> Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-background border border-border p-5">
                  <p className="text-xs text-muted mb-1">BMI</p>
                  {bmi ? (
                    <>
                      <p
                        className={`text-3xl font-bold ${BMI_COLORS[bmi.category]}`}
                      >
                        {bmi.bmi}
                      </p>
                      <p className="text-sm text-muted mt-1">
                        {bmi.label}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted">Enter valid values</p>
                  )}
                </div>
                <div className="rounded-2xl bg-background border border-border p-5">
                  <p className="text-xs text-muted mb-1">Maintenance calories</p>
                  {tdee ? (
                    <>
                      <p className="text-3xl font-bold text-accent">
                        {tdee.toLocaleString("en-BD")}
                      </p>
                      <p className="text-sm text-muted mt-1">kcal / day</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted">Enter valid values</p>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 text-sm text-muted">
                For fat loss, aim roughly{" "}
                <span className="text-accent font-medium">
                  {tdee ? `${Math.round(tdee * 0.8).toLocaleString("en-BD")}` : "—"}
                </span>{" "}
                kcal/day; for lean bulk, about{" "}
                <span className="text-accent font-medium">
                  {tdee ? `${Math.round(tdee * 1.1).toLocaleString("en-BD")}` : "—"}
                </span>
                . Estimates only.
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setWeight("70");
                  setHeight("170");
                  setAge("28");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
