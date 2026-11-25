// The three meal plans offered on the site. Prices and meal counts are confirmed by the kitchen.
import { MENU } from "@/data/menu";

export type Plan = {
  name: string;
  subtitle: string;
  description: string;
  categories: string[];
  sample: string;
  tag: string;
};

export const PLANS: Plan[] = [
  { name: "Everyday Balance", subtitle: "A little variety. A better routine.", description: "Bowls, crisp salads and satisfying wraps for your everyday meals.", categories: ["Bowls", "Salads", "Wraps"], sample: "Balanced Black Channa", tag: "Everyday meals" },
  { name: "Protein Routine", subtitle: "For your post-workout appetite.", description: "Paneer and chicken favourites, with protein-focused choices from our menu.", categories: ["Bowls", "Wraps", "Salads"], sample: "Tandoori Chicken Burrito Bowl", tag: "Protein-focused" },
  { name: "Breakfast Club", subtitle: "Give your mornings something good.", description: "Overnight oats and whey oats for a breakfast routine worth waking up for.", categories: ["Oats"], sample: "Berry Vanilla Whey Oats", tag: "Morning favourites" },
];

export const PLAN_NAMES: string[] = PLANS.map((plan) => plan.name);
export const DURATIONS = ["Weekly", "Monthly"] as const;
export const DIETS = ["Vegetarian", "Non-vegetarian", "Vegan"] as const;

export function planByName(name: string): Plan | undefined {
  return PLANS.find((plan) => plan.name === name);
}

export function sampleDishOf(plan: Plan) {
  return MENU.find((dish) => dish.name === plan.sample);
}
