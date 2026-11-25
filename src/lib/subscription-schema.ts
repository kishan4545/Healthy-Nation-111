// Validation shared by the on-site meal-plan form and the server that stores it.
import { email, enum as zodEnum, literal, object, string, union } from "zod/v4";
import type { input } from "zod/v4";
import { DIETS, DURATIONS, PLAN_NAMES } from "@/data/plans";

export const requestSchema = object({
  plan: string().refine((value) => PLAN_NAMES.includes(value), { message: "Choose one of our three meal plans." }),
  duration: zodEnum(DURATIONS),
  diet: zodEnum(DIETS),
  name: string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  phone: string().trim().regex(/^[0-9+\-\s()]{8,20}$/, "Please enter a valid phone number."),
  email: union([literal(""), email("Please enter a valid email address.")]).optional(),
  address: string().trim().max(300, "Delivery address is too long.").optional(),
  notes: string().trim().max(1000, "Please keep your note under 1000 characters.").optional(),
});

export type SubscriptionRequestInput = input<typeof requestSchema>;
