import { Card } from "../ui/Card";
import { useCountUp } from "../../lib/useCountUp";
import { siteStats } from "../../data/testimonials";

function Stat({ value, suffix, label, prefix }: {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}) {
  const { value: n, ref } = useCountUp(value);
  return (
    <Card variant="bordered" className="text-center">
      <span
        ref={ref}
        className="text-4xl md:text-5xl font-bold text-accent tabular-nums"
      >
        {prefix}
        {n.toLocaleString("en-BD")}
        {suffix}
      </span>
      <p className="text-sm text-muted mt-2">{label}</p>
    </Card>
  );
}

export default function StatsBand() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {siteStats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
