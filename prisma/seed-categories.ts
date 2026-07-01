import "dotenv/config";

import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

// ─── Seed Data ────────────────────────────────────────────────────────────────

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, devices, and tech accessories",
    image: null,
    children: [
      { name: "Phones", slug: "phones", description: "Smartphones and accessories", image: null },
      { name: "Laptops", slug: "laptops", description: "Laptops and notebooks", image: null },
      { name: "Tablets", slug: "tablets", description: "Tablets and iPads", image: null },
      { name: "Audio", slug: "audio", description: "Headphones, speakers, and earbuds", image: null },
      { name: "Cameras", slug: "cameras", description: "Cameras and photography gear", image: null },
      { name: "Wearables", slug: "wearables", description: "Smartwatches and fitness trackers", image: null },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    image: null,
    children: [
      { name: "Men's Wear", slug: "mens", description: "Men's clothing", image: null },
      { name: "Women's Wear", slug: "womens", description: "Women's clothing", image: null },
      { name: "Kids' Wear", slug: "kids-wear", description: "Kids' clothing", image: null },
      { name: "Footwear", slug: "footwear", description: "Shoes and sandals", image: null },
      { name: "Accessories", slug: "accessories", description: "Watches, belts, and more", image: null },
      { name: "Bags & Luggage", slug: "bags", description: "Bags, backpacks, and luggage", image: null },
    ],
  },
  {
    name: "Home & Living",
    slug: "home",
    description: "Everything for your home",
    image: null,
    children: [
      { name: "Furniture", slug: "furniture", description: "Sofas, tables, beds, and storage", image: null },
      { name: "Decor", slug: "decor", description: "Lamps, art, and home accessories", image: null },
      { name: "Kitchen", slug: "kitchen", description: "Kitchenware and appliances", image: null },
      { name: "Lighting", slug: "lighting", description: "Lights and lighting solutions", image: null },
      { name: "Storage & Organization", slug: "storage", description: "Storage solutions", image: null },
    ],
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Beauty and personal care products",
    image: null,
    children: [
      { name: "Skincare", slug: "skincare", description: "Skincare products", image: null },
      { name: "Haircare", slug: "haircare", description: "Haircare products", image: null },
      { name: "Makeup", slug: "makeup", description: "Makeup and cosmetics", image: null },
      { name: "Fragrance", slug: "fragrance", description: "Perfumes and fragrances", image: null },
      { name: "Bath & Body", slug: "bath-body", description: "Bath and body products", image: null },
    ],
  },
  {
    name: "Sports & Outdoors",
    slug: "sports",
    description: "Gear for every sport and workout",
    image: null,
    children: [
      { name: "Fitness", slug: "fitness", description: "Gym and fitness equipment", image: null },
      { name: "Cycling", slug: "cycling", description: "Bikes and cycling gear", image: null },
      { name: "Camping", slug: "camping", description: "Camping and hiking gear", image: null },
      { name: "Team Sports", slug: "team-sports", description: "Cricket, football, and more", image: null },
      { name: "Swimming", slug: "swimming", description: "Swimming gear and accessories", image: null },
    ],
  },
  {
    name: "Books & Stationery",
    slug: "books",
    description: "Books, comics, and stationery",
    image: null,
    children: [
      { name: "Fiction", slug: "fiction", description: "Novels and short stories", image: null },
      { name: "Non-Fiction", slug: "non-fiction", description: "Biographies, self-help, and more", image: null },
      { name: "Comics & Graphic Novels", slug: "comics", description: "Comics and graphic novels", image: null },
      { name: "Stationery", slug: "stationery", description: "Pens, notebooks, and office supplies", image: null },
      { name: "Art Supplies", slug: "art-supplies", description: "Art and craft supplies", image: null },
    ],
  },
  {
    name: "Toys & Kids",
    slug: "toys",
    description: "Toys, games, and kids' essentials",
    image: null,
    children: [
      { name: "Toys & Games", slug: "toys-games", description: "Toys and board games", image: null },
      { name: "Baby Care", slug: "baby", description: "Baby care products", image: null },
      { name: "School Supplies", slug: "school", description: "School bags and supplies", image: null },
      { name: "Outdoor Play", slug: "outdoor-play", description: "Outdoor toys and play equipment", image: null },
      { name: "Learning & Education", slug: "learning", description: "Educational toys and books", image: null },
    ],
  },
  {
    name: "Groceries",
    slug: "groceries",
    description: "Daily groceries and essentials",
    image: null,
    children: [
      { name: "Fresh Produce", slug: "fresh", description: "Fruits and vegetables", image: null },
      { name: "Snacks", slug: "snacks", description: "Snacks and munchies", image: null },
      { name: "Beverages", slug: "beverages", description: "Drinks and beverages", image: null },
      { name: "Pantry Staples", slug: "pantry", description: "Rice, pulses, and staples", image: null },
      { name: "Dairy & Eggs", slug: "dairy", description: "Milk, cheese, and eggs", image: null },
      { name: "Frozen Foods", slug: "frozen", description: "Frozen meals and foods", image: null },
    ],
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "Car and bike accessories",
    image: null,
    children: [
      { name: "Car Accessories", slug: "car-accessories", description: "Car accessories and parts", image: null },
      { name: "Bike Accessories", slug: "bike-accessories", description: "Bike accessories and gear", image: null },
      { name: "Tools & Equipment", slug: "tools", description: "Car repair tools", image: null },
      { name: "Car Care", slug: "car-care", description: "Car cleaning and care products", image: null },
    ],
  },
  {
    name: "Health & Wellness",
    slug: "health",
    description: "Health and wellness products",
    image: null,
    children: [
      { name: "Supplements", slug: "supplements", description: "Vitamins and supplements", image: null },
      { name: "Medical Supplies", slug: "medical-supplies", description: "Medical supplies and equipment", image: null },
      { name: "Personal Hygiene", slug: "personal-hygiene", description: "Hygiene products", image: null },
      { name: "Wellness Devices", slug: "wellness-devices", description: "Health monitoring devices", image: null },
    ],
  },
  {
    name: "Pet Supplies",
    slug: "pets",
    description: "Everything for your pets",
    image: null,
    children: [
      { name: "Pet Food", slug: "pet-food", description: "Dog, cat, and other pet food", image: null },
      { name: "Pet Toys", slug: "pet-toys", description: "Toys for pets", image: null },
      { name: "Pet Grooming", slug: "pet-grooming", description: "Pet grooming products", image: null },
      { name: "Pet Accessories", slug: "pet-accessories", description: "Leashes, beds, and accessories", image: null },
    ],
  },
  {
    name: "Office & Business",
    slug: "office",
    description: "Office and business essentials",
    image: null,
    children: [
      { name: "Office Supplies", slug: "office-supplies", description: "Office stationery and supplies", image: null },
      { name: "Office Furniture", slug: "office-furniture", description: "Desks, chairs, and storage", image: null },
      { name: "Printers & Ink", slug: "printers", description: "Printers and cartridges", image: null },
      { name: "Software", slug: "software", description: "Business and productivity software", image: null },
    ],
  },
];

// ─── Seed Logic ───────────────────────────────────────────────────────────────

type CategoryInput = {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  children?: CategoryInput[];
};

async function seedCategory(
  category: CategoryInput,
  parentId: string | null = null
): Promise<void> {
  const { children, ...data } = category;

  // Upsert so re-running the seed is safe (won't duplicate)
  const created = await prisma.category.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      description: data.description,
      image: data.image,
      parentId,
    },
    create: {
      ...data,
      parentId,
    },
  });

  console.log(
    `  ${parentId ? "  └─" : "─"} ${created.name} (${created.slug})`
  );

  if (children?.length) {
    for (const child of children) {
      await seedCategory(child, created.id);
    }
  }
}

async function main() {
  console.log("🌱 Seeding categories...\n");

  for (const category of categories) {
    await seedCategory(category);
  }

  const total = await prisma.category.count();
  console.log(`\n✅ Done — ${total} categories in the database.`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });