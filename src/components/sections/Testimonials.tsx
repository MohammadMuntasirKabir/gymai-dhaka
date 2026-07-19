import { Quote, Star } from "lucide-react";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";
import { testimonials } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved Across <span className="text-accent">Dhaka</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Real members training at our partner gyms on free AI plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08}>
              <Card
                variant="bordered"
                className="h-full flex flex-col hover:border-accent/40 transition-colors"
              >
                <Quote className="w-7 h-7 text-accent/40 mb-3" />
                <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s < t.rating
                          ? "text-accent fill-accent"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.role} · {t.area}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
