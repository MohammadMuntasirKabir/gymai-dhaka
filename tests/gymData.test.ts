import { describe, it, expect } from "vitest";
import {
  partnerGyms,
  pricingTiers,
  formatBDT,
  offlinePaymentNote,
  freeAITag,
} from "../src/data/gymData";
import type { GymPartner, PricingTier } from "../src/types";

describe("gymData", () => {
  describe("partnerGyms", () => {
    it("should have 6 partner gyms", () => {
      expect(partnerGyms).toHaveLength(6);
    });

    it("should have all required fields for each gym", () => {
      partnerGyms.forEach((gym) => {
        expect(gym).toHaveProperty("id");
        expect(gym).toHaveProperty("name");
        expect(gym).toHaveProperty("area");
        expect(gym).toHaveProperty("address");
        expect(gym).toHaveProperty("lat");
        expect(gym).toHaveProperty("lng");
        expect(gym).toHaveProperty("phone");
        expect(gym).toHaveProperty("hours");
        expect(gym).toHaveProperty("facilities");
      });
    });

    it("should have valid coordinates for each gym", () => {
      partnerGyms.forEach((gym) => {
        expect(typeof gym.lat).toBe("number");
        expect(typeof gym.lng).toBe("number");
        expect(gym.lat).toBeGreaterThan(-90);
        expect(gym.lat).toBeLessThan(90);
        expect(gym.lng).toBeGreaterThan(-180);
        expect(gym.lng).toBeLessThan(180);
      });
    });

    it("should have non-empty facilities array for each gym", () => {
      partnerGyms.forEach((gym) => {
        expect(Array.isArray(gym.facilities)).toBe(true);
        expect(gym.facilities.length).toBeGreaterThan(0);
      });
    });

    it("should have unique ids", () => {
      const ids = partnerGyms.map((g) => g.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should include gyms in expected areas", () => {
      const areas = partnerGyms.map((g) => g.area);
      expect(areas).toContain("Gulshan 2, Dhaka");
      expect(areas).toContain("Dhanmondi, Dhaka");
      expect(areas).toContain("Sector 7, Uttara, Dhaka");
      expect(areas).toContain("Mirpur 10, Dhaka");
      expect(areas).toContain("Banani, Dhaka");
      expect(areas).toContain("Mohakhali, Dhaka");
    });

    it("should have valid phone numbers", () => {
      partnerGyms.forEach((gym) => {
        expect(gym.phone).toMatch(/^\+880\s1700-\d{6}$/);
      });
    });
  });

  describe("pricingTiers", () => {
    it("should have 4 pricing tiers", () => {
      expect(pricingTiers).toHaveLength(4);
    });

    it("should have all required fields for each tier", () => {
      pricingTiers.forEach((tier) => {
        expect(tier).toHaveProperty("name");
        expect(tier).toHaveProperty("priceBDT");
        expect(tier).toHaveProperty("duration");
        expect(tier).toHaveProperty("features");
      });
    });

    it("should have positive prices", () => {
      pricingTiers.forEach((tier) => {
        expect(tier.priceBDT).toBeGreaterThan(0);
      });
    });

    it("should have non-empty features array for each tier", () => {
      pricingTiers.forEach((tier) => {
        expect(Array.isArray(tier.features)).toBe(true);
        expect(tier.features.length).toBeGreaterThan(0);
      });
    });

    it("should have exactly one popular tier", () => {
      const popularTiers = pricingTiers.filter((t) => t.popular);
      expect(popularTiers).toHaveLength(1);
    });

    it("should have expected tier names", () => {
      const names = pricingTiers.map((t) => t.name);
      expect(names).toContain("Day Pass");
      expect(names).toContain("Monthly");
      expect(names).toContain("3-Month Package");
      expect(names).toContain("Annual");
    });

    it("should have increasing prices for longer commitments", () => {
      const dayPass = pricingTiers.find((t) => t.name === "Day Pass");
      const monthly = pricingTiers.find((t) => t.name === "Monthly");
      const threeMonth = pricingTiers.find((t) => t.name === "3-Month Package");
      const annual = pricingTiers.find((t) => t.name === "Annual");

      expect(dayPass!.priceBDT).toBeLessThan(monthly!.priceBDT);
      expect(monthly!.priceBDT).toBeLessThan(threeMonth!.priceBDT);
      expect(threeMonth!.priceBDT).toBeLessThan(annual!.priceBDT);
    });
  });

  describe("formatBDT", () => {
    it("should format numbers with BDT symbol", () => {
      expect(formatBDT(500)).toBe("৳500");
      expect(formatBDT(3500)).toBe("৳3,500");
      expect(formatBDT(30000)).toBe("৳30,000");
    });

    it("should handle zero", () => {
      expect(formatBDT(0)).toBe("৳0");
    });

    it("should handle large numbers", () => {
      expect(formatBDT(1000000)).toBe("৳1,000,000");
    });
  });

  describe("offlinePaymentNote", () => {
    it("should be a non-empty string", () => {
      expect(typeof offlinePaymentNote).toBe("string");
      expect(offlinePaymentNote.length).toBeGreaterThan(0);
    });

    it("should mention offline payment", () => {
      expect(offlinePaymentNote.toLowerCase()).toContain("offline");
    });
  });

  describe("freeAITag", () => {
    it("should be a non-empty string", () => {
      expect(typeof freeAITag).toBe("string");
      expect(freeAITag.length).toBeGreaterThan(0);
    });

    it("should mention free", () => {
      expect(freeAITag.toLowerCase()).toContain("free");
    });
  });
});
