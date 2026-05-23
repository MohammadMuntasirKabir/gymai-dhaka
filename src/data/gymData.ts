import type { GymPartner, PricingTier } from "../types";

export const partnerGyms: GymPartner[] = [
  {
    id: "gulshan-fitness",
    name: "GymAI Fitness – Gulshan",
    area: "Gulshan 2, Dhaka",
    address: "House 45, Road 11, Gulshan 2, Dhaka 1212",
    lat: 23.7935,
    lng: 90.4143,
    phone: "+880 1700-111111",
    hours: "Sat–Thu: 6:00 AM – 11:00 PM | Fri: 2:00 PM – 10:00 PM",
    facilities: ["Cardio Zone", "Free Weights", "Personal Training", "Locker Room", "Wi-Fi"],
  },
  {
    id: "dhanmondi-fitness",
    name: "GymAI Fitness – Dhanmondi",
    area: "Dhanmondi, Dhaka",
    address: "House 28, Road 27, Dhanmondi, Dhaka 1209",
    lat: 23.7465,
    lng: 90.3762,
    phone: "+880 1700-222222",
    hours: "Sat–Thu: 5:30 AM – 10:30 PM | Fri: 1:00 PM – 9:30 PM",
    facilities: ["Cardio Zone", "Free Weights", "Group Classes", "Steam & Sauna", "Parking"],
  },
  {
    id: "uttara-fitness",
    name: "GymAI Fitness – Uttara",
    area: "Sector 7, Uttara, Dhaka",
    address: "Plot 12, Sector 7, Uttara Model Town, Dhaka 1230",
    lat: 23.8728,
    lng: 90.3984,
    phone: "+880 1700-333333",
    hours: "Sat–Thu: 6:00 AM – 11:00 PM | Fri: 2:00 PM – 10:00 PM",
    facilities: ["Cardio Zone", "Free Weights", "Swimming Pool", "Personal Training", "Cafeteria"],
  },
  {
    id: "mirpur-fitness",
    name: "GymAI Fitness – Mirpur",
    area: "Mirpur 10, Dhaka",
    address: "14/A Mirpur 10 Roundabout, Mirpur, Dhaka 1216",
    lat: 23.8069,
    lng: 90.3634,
    phone: "+880 1700-444444",
    hours: "Sat–Thu: 5:00 AM – 11:00 PM | Fri: 1:00 PM – 10:00 PM",
    facilities: ["Cardio Zone", "Free Weights", "Boxing Ring", "Group Classes", "Locker Room"],
  },
  {
    id: "banani-fitness",
    name: "GymAI Fitness – Banani",
    area: "Banani, Dhaka",
    address: "House 73, Road 11, Banani, Dhaka 1213",
    lat: 23.7937,
    lng: 90.4029,
    phone: "+880 1700-555555",
    hours: "Sat–Thu: 6:00 AM – 11:00 PM | Fri: 2:00 PM – 10:00 PM",
    facilities: ["Cardio Zone", "Free Weights", "Yoga Studio", "Steam & Sauna", "Wi-Fi"],
  },
  {
    id: "mohakhali-fitness",
    name: "GymAI Fitness – Mohakhali",
    area: "Mohakhali, Dhaka",
    address: "12/C Mohakhali C/A, Dhaka 1212",
    lat: 23.7786,
    lng: 90.4050,
    phone: "+880 1700-666666",
    hours: "Sat–Thu: 5:30 AM – 10:30 PM | Fri: 1:30 PM – 9:30 PM",
    facilities: ["Cardio Zone", "Free Weights", "CrossFit Area", "Personal Training", "Parking"],
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Day Pass",
    priceBDT: 500,
    duration: "per day",
    features: [
      "Access to one partner gym",
      "All equipment & facilities",
      "Locker room access",
      "Valid for 24 hours",
    ],
  },
  {
    name: "Monthly",
    priceBDT: 3500,
    duration: "per month",
    features: [
      "Access to all 6 partner gyms",
      "All equipment & facilities",
      "Group classes included",
      "Locker room & Wi-Fi",
    ],
    popular: true,
  },
  {
    name: "3-Month Package",
    priceBDT: 9000,
    duration: "3 months",
    features: [
      "Access to all 6 partner gyms",
      "All equipment & facilities",
      "Group classes included",
      "2 free personal training sessions",
      "Save ৳1,500 vs monthly",
    ],
  },
  {
    name: "Annual",
    priceBDT: 30000,
    duration: "12 months",
    features: [
      "Access to all 6 partner gyms",
      "All equipment & facilities",
      "Unlimited group classes",
      "6 free personal training sessions",
      "Priority support",
      "Save ৳12,000 vs monthly",
    ],
  },
];

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export const offlinePaymentNote =
  "All memberships are purchased offline at the gym counter. Pay with cash or mobile banking when you visit.";

export const freeAITag = "AI training plans always free";

