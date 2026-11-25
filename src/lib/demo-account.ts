import type { SubscriptionRequest } from "@/lib/dashboard.functions";

export const DEMO_ADMIN = {
  email: "admin@healthynation.demo",
  password: "admin123",
};

export const DEMO_CUSTOMER = {
  email: "customer@healthynation.demo",
  password: "customer123",
};

export const DEMO_SUBSCRIPTIONS: SubscriptionRequest[] = [
  {
    id: "demo-request-1",
    created_at: "2026-11-20T09:30:00.000Z",
    plan_name: "Protein Routine",
    duration: "Monthly",
    diet: "Vegetarian",
    name: "Demo Customer",
    phone: "+91 98765 43210",
    email: DEMO_CUSTOMER.email,
    address: "JP Nagar 2nd Phase, Bengaluru",
    notes: "No peanuts",
    status: "active",
  },
  {
    id: "demo-request-2",
    created_at: "2026-10-14T12:15:00.000Z",
    plan_name: "Breakfast Club",
    duration: "Weekly",
    diet: "Vegan",
    name: "Demo Customer",
    phone: "+91 98765 43210",
    email: DEMO_CUSTOMER.email,
    address: "JP Nagar 5th Phase, Bengaluru",
    notes: "Morning delivery",
    status: "cancelled",
  },
];

export const DEMO_REQUESTS: SubscriptionRequest[] = [
  ...DEMO_SUBSCRIPTIONS.filter((request) => request.id === "demo-request-1"),
  {
    id: "demo-request-3",
    created_at: "2026-11-23T14:45:00.000Z",
    plan_name: "Everyday Balance",
    duration: "Weekly",
    diet: "Non-vegetarian",
    name: "Aarav Sharma",
    phone: "+91 99876 54321",
    email: "aarav@example.com",
    address: "JP Nagar 7th Phase",
    notes: "Low spice",
    status: "new",
  },
  {
    id: "demo-request-4",
    created_at: "2026-11-24T08:10:00.000Z",
    plan_name: "Breakfast Club",
    duration: "Monthly",
    diet: "Vegetarian",
    name: "Meera Nair",
    phone: "+91 91234 56789",
    email: "meera@example.com",
    address: "Bannerghatta Road",
    notes: "No added sugar",
    status: "contacted",
  },
];
