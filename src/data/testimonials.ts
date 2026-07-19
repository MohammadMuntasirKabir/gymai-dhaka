import type { Sex, ActivityLevel } from "../lib/fitness";

export interface Testimonial {
  name: string;
  area: string;
  role: string;
  quote: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Tasnim Ahmed",
    area: "Gulshan",
    role: "Software Engineer",
    quote:
      "The AI plan actually understood my knee issue and swapped out every squat. Lost 4kg in two months training at the Gulshan branch.",
    rating: 5,
  },
  {
    name: "Rakib Hassan",
    area: "Dhanmondi",
    role: "University Student",
    quote:
      "Free plan, real results. I just walk into the Dhanmondi gym, show my QR, and train. No subscription headaches.",
    rating: 5,
  },
  {
    name: "Farzana Yesmin",
    area: "Banani",
    role: "Marketing Lead",
    quote:
      "I travel between Banani and Mohakhali for work, so one membership covering all six gyms is a lifesaver. The app keeps me on track.",
    rating: 4,
  },
  {
    name: "Imtiaz Rahman",
    area: "Mirpur",
    role: "Physiotherapist",
    quote:
      "As someone in the field, I'm picky about programming. The progression strategy here is genuinely sound.",
    rating: 5,
  },
  {
    name: "Sabrina K.",
    area: "Uttara",
    role: "Homemaker",
    quote:
      "The dumbbells-only version let me start at home, then I upgraded to a monthly pass at Uttara. Smooth transition.",
    rating: 4,
  },
  {
    name: "Arif Chowdhury",
    area: "Mohakhali",
    role: "Business Owner",
    quote:
      "Best ৳3,500 I spend each month. The plan regenerates when I plateau — I've never been stronger.",
    rating: 5,
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: "Is the AI training plan really free?",
    a: "Yes. Your personalized AI training plan is always free — no trial, no card, no lock-in. You only pay if you want gym access, and that's paid directly at the counter.",
  },
  {
    q: "Do I need to be a member to use the AI planner?",
    a: "No. Sign up, answer a few questions about your goals and experience, and get your plan instantly. Gym membership is completely optional.",
  },
  {
    q: "Which gyms can I train at?",
    a: "Six partner locations across Dhaka: Gulshan, Dhanmondi, Uttara, Mirpur, Banani and Mohakhali. A monthly pass or above gives you access to all of them.",
  },
  {
    q: "How is payment handled?",
    a: "All memberships are purchased offline at the gym counter — cash or mobile banking (bKash/Nagad). We never process online payments.",
  },
  {
    q: "Can the AI account for my injuries?",
    a: "Absolutely. During onboarding you can note any injuries or limitations, and the plan avoids aggravating movements and suggests alternatives.",
  },
  {
    q: "What if I stop seeing progress?",
    a: "You can regenerate your plan any time from your profile. The AI builds a fresh program based on your current stats and goals.",
  },
];

export interface SiteStat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export const siteStats: SiteStat[] = [
  { value: 6, suffix: "", label: "Partner Gyms in Dhaka" },
  { value: 12000, suffix: "+", label: "Free Plans Generated" },
  { value: 500, suffix: "৳", prefix: "from ", label: "Day Pass" },
  { value: 98, suffix: "%", label: "Would Recommend" },
];

export const BMI_PRESETS: { label: string; weight: number; height: number }[] = [
  { label: "Example", weight: 70, height: 170 },
];

export type { Sex, ActivityLevel };
