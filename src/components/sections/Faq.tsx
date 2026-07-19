import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";
import { faqs } from "../../data/testimonials";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions, <span className="text-accent">Answered</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <Card variant="bordered" className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left py-1"
                  >
                    <span className="font-medium">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-accent flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-sm text-muted pt-3 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
