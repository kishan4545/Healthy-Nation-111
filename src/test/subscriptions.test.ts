import { describe, expect, it } from "vitest";
import { plans } from "@/routes/subscriptions";
import { DIETS, DURATIONS, PLAN_NAMES, PLANS } from "@/data/plans";
import { requestSchema } from "@/lib/subscription-schema";

const valid = {
  plan: "Everyday Balance",
  duration: "Weekly",
  diet: "Vegetarian",
  name: "Kishan",
  phone: "+91 88617 59545",
  email: "",
  address: "JP Nagar 1st Phase",
  notes: "",
};

describe("meal plans", () => {
  it("offers exactly three different plans", () => {
    expect(plans).toHaveLength(3);
    expect(new Set(plans.map((plan) => plan.name)).size).toBe(3);
    expect(plans).toEqual(PLANS);
  });

  it("keeps every plan name in the list the form accepts", () => {
    expect(PLAN_NAMES).toEqual(["Everyday Balance", "Protein Routine", "Breakfast Club"]);
    for (const plan of plans) expect(PLAN_NAMES).toContain(plan.name);
  });
});

describe("on-site meal plan requests", () => {
  it("accepts a complete request with an empty optional email", () => {
    expect(requestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a plan that is not one of the three offered", () => {
    const result = requestSchema.safeParse({ ...valid, plan: "Free Lunch Pass" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Choose one of our three meal plans.");
  });

  it("rejects a missing name and a short phone number", () => {
    expect(requestSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
    expect(requestSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("rejects an email that is not a real address", () => {
    expect(requestSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("only allows the durations and diets the form offers", () => {
    expect(DURATIONS).toEqual(["Weekly", "Monthly"]);
    expect(DIETS).toEqual(["Vegetarian", "Non-vegetarian", "Vegan"]);
    expect(requestSchema.safeParse({ ...valid, duration: "Yearly" }).success).toBe(false);
    expect(requestSchema.safeParse({ ...valid, diet: "Keto" }).success).toBe(false);
  });
});
