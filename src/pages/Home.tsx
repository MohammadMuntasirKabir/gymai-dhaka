import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Zap,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  CreditCard,
  Gift,
  Banknote,
  Smartphone,
  Download,
  Shield,
  Wifi,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  pricingTiers,
  partnerGyms,
  formatBDT,
  offlinePaymentNote,
  freeAITag,
} from "../data/gymData";

const features = [
  {
    icon: Sparkles,
    title: "AI Training Plans — Free",
    description:
      "Get a personalized training program built by AI for your goals, experience, and schedule. Always free, no strings attached.",
  },
  {
    icon: MapPin,
    title: "6 Gyms Across Dhaka",
    description:
      "Train at any partner location — Gulshan, Dhanmondi, Uttara, Mirpur, Banani & Mohakhali.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description:
      "Whether you want to build muscle, lose fat, or get stronger — we optimize for your goal.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join a growing community of fitness enthusiasts training together across Dhaka.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Plans that fit your lifestyle. Train 2 days or 6 — we adapt to you.",
  },
  {
    icon: Gift,
    title: "No Subscription Lock-in",
    description:
      "Use the AI planner free forever. Buy a gym membership only when you need access — day pass or monthly.",
  },
];

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#pricing") {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-200 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">
              Free AI training plans for everyone in Dhaka
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Train Smarter,<br />
            <span className="text-accent">Across Dhaka</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-6">
            AI-powered training plans are <span className="text-accent font-semibold">free forever</span>.
            Only gym memberships cost — and you pay at the counter.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-10">
            <Banknote className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">
              Gym access from {formatBDT(500)}/day — pay offline at any partner gym
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/sign-up">
              <Button size="lg" className="gap-2">
                <Gift className="w-5 h-5" />
                Get Your Free AI Plan
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/gyms">
              <Button variant="secondary" size="lg" className="gap-2">
                <MapPin className="w-5 h-5" />
                Explore Gyms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Card variant="bordered" className="border-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-accent/5 via-transparent to-accent/5" />
            <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              {/* Phone mockup with realistic app screen */}
              <div className="flex-shrink-0">
                <svg width="220" height="440" viewBox="0 0 220 440" fill="none" xmlns="http://www.w3.org/200/svg" className="drop-shadow-2xl">
                  {/* Phone frame */}
                  <rect x="4" y="4" width="212" height="432" rx="32" fill="#18181b" stroke="#27272a" strokeWidth="2"/>
                  {/* Screen */}
                  <rect x="14" y="14" width="192" height="412" rx="24" fill="#0a0a0a"/>
                  {/* Notch */}
                  <rect x="70" y="14" width="80" height="20" rx="10" fill="#0a0a0a"/>
                  <circle cx="110" cy="22" r="4" fill="#27272a"/>

                  {/* Status bar */}
                  <text x="28" y="30" fill="#a1a1aa" fontSize="9" fontFamily="system-ui">9:41</text>
                  <text x="155" y="30" fill="#a1a1aa" fontSize="9" fontFamily="system-ui">100%</text>

                  {/* Header */}
                  <rect x="22" y="42" width="176" height="36" rx="8" fill="#18181b"/>
                  <circle cx="38" cy="60" r="10" fill="#a3e635"/>
                  <text x="54" y="57" fill="#fafafa" fontSize="11" fontWeight="600" fontFamily="system-ui">GymAI Dhaka</text>
                  <text x="54" y="69" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">Your AI Training Plan</text>

                  {/* Goal card */}
                  <rect x="22" y="86" width="176" height="52" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1"/>
                  <text x="32" y="102" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">Today's Goal</text>
                  <text x="32" y="116" fill="#fafafa" fontSize="11" fontWeight="600" fontFamily="system-ui">Upper Body Strength</text>
                  <text x="32" y="128" fill="#a3e635" fontSize="9" fontFamily="system-ui">4 exercises • 45 min</text>
                  <rect x="140" y="96" width="48" height="32" rx="8" fill="#a3e635"/>
                  <text x="152" y="116" fill="#000" fontSize="9" fontWeight="600" fontFamily="system-ui">Start</text>

                  {/* Workout cards */}
                  <rect x="22" y="146" width="82" height="90" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1"/>
                  <rect x="30" y="156" width="66" height="40" rx="6" fill="#a3e635"/>
                  <text x="38" y="180" fill="#000" fontSize="16" fontWeight="700" fontFamily="system-ui">💪</text>
                  <text x="30" y="206" fill="#fafafa" fontSize="9" fontWeight="600" fontFamily="system-ui">Push Day</text>
                  <text x="30" y="218" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">5 exercises</text>
                  <text x="30" y="228" fill="#a3e635" fontSize="7" fontFamily="system-ui">RPE 7-8</text>

                  <rect x="112" y="146" width="82" height="90" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1"/>
                  <rect x="120" y="156" width="66" height="40" rx="6" fill="#27272a"/>
                  <text x="138" y="180" fill="#a1a1aa" fontSize="16" fontWeight="700" fontFamily="system-ui">🦵</text>
                  <text x="120" y="206" fill="#fafafa" fontSize="9" fontWeight="600" fontFamily="system-ui">Leg Day</text>
                  <text x="120" y="218" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">6 exercises</text>
                  <text x="120" y="228" fill="#a1a1aa" fontSize="7" fontFamily="system-ui">Tomorrow</text>

                  {/* Weekly progress */}
                  <rect x="22" y="244" width="176" height="64" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1"/>
                  <text x="32" y="260" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">Weekly Progress</text>
                  <text x="32" y="274" fill="#fafafa" fontSize="11" fontWeight="600" fontFamily="system-ui">3 of 4 workouts done</text>
                  {/* Progress bar */}
                  <rect x="32" y="284" width="156" height="8" rx="4" fill="#27272a"/>
                  <rect x="32" y="284" width="117" height="8" rx="4" fill="#a3e635"/>
                  <text x="155" y="300" fill="#a3e635" fontSize="8" fontFamily="system-ui">75%</text>

                  {/* Gym finder card */}
                  <rect x="22" y="316" width="176" height="52" rx="10" fill="#18181b" stroke="#27272a" strokeWidth="1"/>
                  <circle cx="42" cy="342" r="12" fill="#a3e635"/>
                  <text x="38" y="346" fill="#000" fontSize="12" fontFamily="system-ui">📍</text>
                  <text x="62" y="338" fill="#fafafa" fontSize="10" fontWeight="600" fontFamily="system-ui">Find Nearby Gyms</text>
                  <text x="62" y="350" fill="#a1a1aa" fontSize="8" fontFamily="system-ui">6 locations across Dhaka</text>
                  <text x="165" y="344" fill="#a1a1aa" fontSize="14" fontFamily="system-ui">›</text>

                  {/* Bottom nav */}
                  <rect x="14" y="378" width="192" height="40" rx="0" fill="#0a0a0a"/>
                  <rect x="14" y="378" width="192" height="1" fill="#27272a"/>
                  {/* Home icon */}
                  <rect x="30" y="386" width="20" height="20" rx="4" fill="#a3e635"/>
                  <text x="34" y="400" fill="#000" fontSize="10" fontFamily="system-ui">🏠</text>
                  <text x="28" y="414" fill="#a3e635" fontSize="7" fontFamily="system-ui">Home</text>
                  {/* Gyms */}
                  <text x="78" y="400" fill="#a1a1aa" fontSize="12" fontFamily="system-ui">📍</text>
                  <text x="74" y="414" fill="#a1a1aa" fontSize="7" fontFamily="system-ui">Gyms</text>
                  {/* Plan */}
                  <text x="122" y="400" fill="#a1a1aa" fontSize="12" fontFamily="system-ui">💪</text>
                  <text x="118" y="414" fill="#a1a1aa" fontSize="7" fontFamily="system-ui">Plan</text>
                  {/* Profile */}
                  <text x="164" y="400" fill="#a1a1aa" fontSize="12" fontFamily="system-ui">👤</text>
                  <text x="160" y="414" fill="#a1a1aa" fontSize="7" fontFamily="system-ui">Me</text>

                  {/* Home indicator */}
                  <rect x="70" y="422" width="80" height="4" rx="2" fill="#27272a"/>
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Smartphone className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">Mobile App</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get the <span className="text-accent">GymAI App</span>
                </h2>
                <p className="text-muted text-lg mb-6 max-w-lg">
                  Download our mobile app for the best experience on your phone. Get AI training plans, find nearby gyms, and track your workouts — all in your pocket.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-6">
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Download on the</div>
                      <div className="text-sm font-semibold -mt-0.5">App Store</div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-70">Get it on</div>
                      <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                    </div>
                  </a>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-accent" />
                    No account required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-accent" />
                    Works offline
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-accent" />
                    Free download
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Simple as 1-2-3. No online payments, no subscriptions for the app.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="bordered" className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Your Free AI Plan</h3>
              <p className="text-muted text-sm">
                Sign up and answer a few questions about your goals and experience.
                Our AI builds a personalized training program — completely free.
              </p>
            </Card>
            <Card variant="bordered" className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Visit a Partner Gym</h3>
              <p className="text-muted text-sm">
                Walk into any of our 6 partner gyms across Dhaka.
                Buy your membership at the counter — cash or mobile banking.
              </p>
            </Card>
            <Card variant="bordered" className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Train Smarter</h3>
              <p className="text-muted text-sm">
                Follow your AI plan at the gym. Regenerate or update anytime — it's always free.
                One gym membership works at all 6 locations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Gyms Preview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Train at <span className="text-accent">6 Locations</span> Across Dhaka
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Our partner gyms span the city's most convenient neighborhoods.
              Pay at the counter, use any location.
            </p>
          </div>

          {/* Map Preview */}
          <Card variant="bordered" className="mb-8 overflow-hidden p-0">
            <iframe
              title="GymAI Partner Gym Locations in Dhaka"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d90.4125!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </Card>

          {/* Gym location pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {partnerGyms.map((gym) => (
              <Link
                key={gym.id}
                to="/gyms"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-accent/50 transition-colors text-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {gym.area}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gyms">
              <Button variant="ghost" className="gap-2">
                View all gym details <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-accent">GymAI Dhaka</span>?
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Free AI planning meets a citywide gym network. The best fitness experience in Dhaka.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="bordered"
                className="group hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4">
              <CreditCard className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted">Gym memberships — pay at the counter</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gym Membership <span className="text-accent">Pricing</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-4">
              These are for gym access only. AI training plans are <span className="text-accent font-semibold">always free</span> — included for everyone.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Banknote className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">{offlinePaymentNote}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                variant="bordered"
                className={`relative flex flex-col ${
                  tier.popular
                    ? "border-accent ring-1 ring-accent/30 scale-105"
                    : "hover:border-accent/50"
                } transition-all`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-black text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-accent">
                      {formatBDT(tier.priceBDT)}
                    </span>
                    <span className="text-muted text-sm ml-1">
                      /{tier.duration}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {freeAITag}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <Card variant="bordered" className="border-accent/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent" />
            <div className="relative py-8 px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Your Free <span className="text-accent">AI Training Plan</span>
              </h2>
              <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                Sign up free, get your personalized plan in seconds.
                Visit any of our 6 partner gyms in Dhaka when you're ready to train.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/sign-up">
                  <Button size="lg" className="gap-2">
                    <Gift className="w-5 h-5" />
                    Start Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/gyms">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <MapPin className="w-5 h-5" />
                    Find a Gym Near You
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold">GymAI Dhaka</span>
          </div>
          <p className="text-muted text-sm">
            Free AI training plans for everyone. Gym memberships at 6 partner locations across Dhaka, Bangladesh.
          </p>
          <p className="text-muted/60 text-xs mt-3">
            &copy; {new Date().getFullYear()} GymAI Dhaka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
