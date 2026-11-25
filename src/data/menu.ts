// Edit menu items here. Prices from the Healthy Nation Zomato listing.
// kcal / protein values are approximate per serving.
import bowl from "@/assets/hero-bowl.jpg";
import salad from "@/assets/salad.jpg";
import smoothie from "@/assets/smoothie.jpg";
import oats from "@/assets/oats.jpg";
import wrap from "@/assets/wrap.jpg";
import juice from "@/assets/juice.jpg";
import dessert from "@/assets/dessert.jpg";

export const ZOMATO_URL = "https://www.zomato.com/bangalore/healthy-nation-jp-nagar-bangalore/order";
export const PHONE = "+918861759545";
export const ADDRESS = "5, Ground Floor, Shrinivasa, 15th Cross, 2nd Phase, 17th Main Road, Near Asha PG, JP Nagar, Bengaluru";
export const HOURS = "Mon–Sun · 8:30 AM – 11:00 PM";
export const RATING = 4.2;

export const CATEGORIES = ["Bowls", "Salads", "Wraps", "Sandwiches", "Oats", "Smoothies", "Juices", "Shakes & Mojitos", "Desserts", "Snacks"] as const;
export type Category = (typeof CATEGORIES)[number];
export const TAGS = ["High-Protein", "Vegan", "Under 400 kcal"] as const;
export type Tag = (typeof TAGS)[number];

export type Dish = { id: string; name: string; desc: string; price: number; category: Category; veg: boolean; kcal: number; protein: number; image: string; bestseller?: boolean };

const imgFor: Record<Category, string> = { Bowls: bowl, Salads: salad, Wraps: wrap, Sandwiches: wrap, Oats: oats, Smoothies: smoothie, Juices: juice, "Shakes & Mojitos": smoothie, Desserts: dessert, Snacks: wrap };

type Raw = [name: string, price: number, category: Category, veg: boolean, kcal: number, protein: number, desc: string, bestseller?: boolean];
const raw: Raw[] = [
  ["Creamy Paneer Burrito Bowl", 299, "Bowls", true, 560, 28, "Mild, creamy paneer bowl balanced with rice, veggies and smooth dressing."],
  ["Makhani Paneer Burrito Bowl", 299, "Bowls", true, 580, 28, "Low-fat paneer in rich makhani flavours over rice with hearty beans."],
  ["Barbecue Paneer Burrito Bowl", 299, "Bowls", true, 570, 28, "Smoky BBQ-glazed low-fat paneer layered with grains, beans and fresh veg.", true],
  ["Tandoori Chicken Burrito Bowl", 299, "Bowls", false, 520, 38, "Spiced tandoori chicken breast over rice with beans and crunchy veggies.", true],
  ["Chipotle Chicken Burrito Bowl", 239, "Bowls", false, 510, 36, "Bold chipotle chicken breast with grains, beans and vibrant toppings."],
  ["Makhani Chicken Burrito Bowl", 239, "Bowls", false, 540, 36, "Tender chicken breast in buttery makhani seasoning with rice and fresh add-ons."],
  ["BBQ Chicken Burrito Bowl", 299, "Bowls", false, 530, 37, "Smoky BBQ-glazed chicken breast layered with grains, beans and veggies."],
  ["Balanced Black Channa", 154, "Salads", true, 290, 14, "Black chana, corn, raw mango and crunchy vegetables, zesty-tossed.", true],
  ["Mixed Sprouts Bowl", 154, "Salads", true, 240, 13, "Fresh mixed sprouts tossed with veggies and spices — light and zesty."],
  ["Toasted Paneer Salad Bowl", 189, "Salads", true, 340, 24, "Low-fat paneer with fresh greens, veggies and yogurt dressing."],
  ["Chipotle Chicken Salad Bowl", 189, "Salads", false, 320, 30, "Grilled chipotle chicken with crisp vegetables and a light dressing."],
  ["Toasted Paneer Burrito", 199, "Wraps", true, 450, 24, "Smoky roasted paneer and fresh veg wrapped in a warm tortilla."],
  ["Makhani Chicken Burrito", 199, "Wraps", false, 440, 32, "Makhani-style chicken with fresh greens and grains."],
  ["Tandoori Chicken Burrito", 199, "Wraps", false, 430, 32, "Juicy tandoori chicken, crisp veggies and yogurt dressing in a soft wrap.", true],
  ["Peanut Butter Banana Sandwich", 160, "Sandwiches", true, 380, 12, "Peanut butter and banana slices — the classic power combo."],
  ["Tandoori Paneer Sandwich", 160, "Sandwiches", true, 360, 20, "Soft paneer cubes tossed in smoky tandoori flavour."],
  ["Makhani Paneer Sandwich", 160, "Sandwiches", true, 370, 20, "Creamy makhani paneer filling with a mild, buttery finish."],
  ["Tandoori Chicken Sandwich", 160, "Sandwiches", false, 340, 26, "Fresh chicken breast cubes in smoky tandoori spice."],
  ["Makhani Chicken Sandwich", 160, "Sandwiches", false, 350, 26, "Rich makhani chicken breast filling, mildly spiced."],
  ["Apple Cinnamon Oats", 249, "Oats", true, 380, 13, "Overnight oats with apple and warm cinnamon."],
  ["Cocoa Banana Oats", 249, "Oats", true, 410, 14, "Rolled oats, milk, peanut butter, ripe banana, cocoa, yogurt and muesli."],
  ["Chilli Guava Oats", 249, "Oats", true, 360, 12, "Overnight oats with tangy guava and a chilli kick."],
  ["Creamy Sitaphal Oats", 249, "Oats", true, 390, 12, "Overnight oats with creamy custard apple."],
  ["Berry Vanilla Whey Oats", 299, "Oats", true, 430, 30, "Smooth vanilla whey oats packed with fresh berries.", true],
  ["Banana Chocolate Whey Oats", 289, "Oats", true, 450, 30, "Chocolate whey oats with banana and peanut butter."],
  ["Mango Vanilla Whey Oats", 299, "Oats", true, 440, 30, "Oats, milk, peanut butter, mango purée, yogurt and vanilla whey."],
  ["Strawberry Chocolate Whey Oats", 299, "Oats", true, 440, 30, "Oats, peanut butter, strawberry purée, yogurt and chocolate whey."],
  ["Coconut Chocolate Whey Oats", 299, "Oats", true, 460, 30, "Oats, peanut butter, coconut purée, yogurt and chocolate whey."],
  ["Blueberry Smoothie", 259, "Smoothies", true, 330, 12, "Yogurt, premium blueberries, honey and peanut butter."],
  ["Strawberry Smoothie", 259, "Smoothies", true, 320, 12, "Fresh strawberries whipped with yogurt, honey and peanut butter."],
  ["Blackberry Smoothie", 259, "Smoothies", true, 330, 12, "Bold blackberry with creamy yogurt, honey and peanut butter."],
  ["Mango Smoothie", 259, "Smoothies", true, 340, 11, "Ripe mangoes, yogurt, honey and peanut butter — tropical and velvety.", true],
  ["Gut Reset Juice", 149, "Juices", true, 110, 1, "Cold-pressed cucumber, pineapple, mint, lemon and ginger."],
  ["Skin Rejuvenation Juice", 149, "Juices", true, 130, 2, "Orange, carrot, lemon, ginger and mint — antioxidant-rich."],
  ["Hydration Fix Juice", 149, "Juices", true, 100, 1, "Coconut water, watermelon, mint and lemon. Perfect post-workout."],
  ["Watermelon Protein Mojito", 249, "Shakes & Mojitos", true, 140, 25, "Whey isolate with watermelon and a hint of real fruit."],
  ["Pineapple Protein Mojito", 249, "Shakes & Mojitos", true, 140, 25, "Tropical whey isolate drink with real pineapple."],
  ["Peach Tea Protein Mojito", 249, "Shakes & Mojitos", true, 130, 25, "Light peach tea whey isolate with real fruit essence."],
  ["Vanilla Protein Milkshake", 259, "Shakes & Mojitos", true, 310, 30, "Vanilla whey, milk and low-cal vanilla ice cream."],
  ["Chocolate Protein Milkshake", 259, "Shakes & Mojitos", true, 320, 30, "Chocolate whey, milk and low-cal chocolate ice cream."],
  ["Fresh Fruit Yogurt Bowl", 149, "Desserts", true, 260, 12, "Exotic fruits layered on creamy Greek yogurt."],
  ["Choco Protein Brownie", 139, "Desserts", false, 220, 15, "Fudgy brownie made with chocolate whey, egg and cocoa."],
  ["Blueberry Cheesecake", 249, "Desserts", true, 290, 12, "Yogurt-based cheesecake with light cream cheese and blueberries."],
  ["Strawberry Cheesecake", 249, "Desserts", true, 290, 12, "Silky yogurt and light cream cheese with strawberry."],
  ["Masala Omelette", 79, "Snacks", false, 200, 13, "Fluffy eggs with veggies and classic Indian spices."],
  ["Bread Omelette (2 Eggs)", 89, "Snacks", false, 290, 16, "Whole-wheat bread with a creamy omelette."],
];

const veganNames = new Set(["Balanced Black Channa", "Mixed Sprouts Bowl", "Gut Reset Juice", "Skin Rejuvenation Juice", "Hydration Fix Juice"]);

export const MENU: Dish[] = raw.map(([name, price, category, veg, kcal, protein, desc, bestseller]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, price, category, veg, kcal, protein, desc, image: imgFor[category], ...(bestseller ? { bestseller } : {}),
}));

export function tagsOf(d: Dish): Tag[] {
  const t: Tag[] = [];
  if (d.protein >= 25) t.push("High-Protein");
  if (veganNames.has(d.name)) t.push("Vegan");
  if (d.kcal < 400) t.push("Under 400 kcal");
  return t;
}

export type Goal = "lose" | "muscle" | "energy";
export type Diet = "veg" | "nonveg" | "vegan";
export type Budget = 200 | 300 | 1000;

export function recommend(goal: Goal, diet: Diet, budget: Budget): Dish[] {
  let pool = MENU.filter((d) => d.price <= budget);
  if (diet === "veg") pool = pool.filter((d) => d.veg);
  if (diet === "vegan") pool = pool.filter((d) => veganNames.has(d.name));
  const score = (d: Dish) => goal === "lose" ? d.protein / d.kcal * 100 - d.kcal / 50 : goal === "muscle" ? d.protein * 2 - d.price / 50 : (d.category === "Juices" || d.category === "Smoothies" || d.category === "Oats" ? 20 : 0) + d.kcal / 40;
  const sorted = [...pool].sort((a, b) => score(b) - score(a));
  const picks: Dish[] = [];
  for (const d of sorted) { if (!picks.some((p) => p.category === d.category)) picks.push(d); if (picks.length === 3) break; }
  for (const d of sorted) { if (picks.length === 3) break; if (!picks.includes(d)) picks.push(d); }
  return picks;
}
