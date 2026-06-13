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
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    name: "Electronics",
    slug: "electronics",
    description: "Gadgets, devices, and tech accessories",
    image: null,
    children: [
      {
        name: "Phones",
        slug: "phones",
        description: "Smartphones and accessories",
        image: null,
        children: [
          { name: "Android", slug: "android", description: "Android smartphones", image: null },
          { name: "iPhone", slug: "iphone", description: "Apple iPhones", image: null },
          { name: "Phone Accessories", slug: "phone-accessories", description: "Cases, chargers, screen guards", image: null },
        ],
      },
      {
        name: "Laptops",
        slug: "laptops",
        description: "Laptops and notebooks",
        image: null,
        children: [
          { name: "Gaming Laptops", slug: "gaming-laptops", description: "High-performance gaming laptops", image: null },
          { name: "Ultrabooks", slug: "ultrabooks", description: "Thin and light laptops", image: null },
        ],
      },
      {
        name: "Audio",
        slug: "audio",
        description: "Headphones, speakers, and earbuds",
        image: null,
        children: [
          { name: "Headphones", slug: "headphones", description: "Over-ear and on-ear headphones", image: null },
          { name: "Earbuds", slug: "earbuds", description: "Wireless and wired earbuds", image: null },
          { name: "Speakers", slug: "speakers", description: "Bluetooth and wired speakers", image: null },
        ],
      },
    ],
  },

  // ── Clothing ─────────────────────────────────────────────────────────────
  {
    name: "Clothing",
    slug: "clothing",
    description: "Fashion for men, women, and kids",
    image: null,
    children: [
      {
        name: "Men",
        slug: "men",
        description: "Men's clothing",
        image: null,
        children: [
          { name: "T-Shirts", slug: "men-tshirts", description: "Casual and formal tees", image: null },
          { name: "Shirts", slug: "men-shirts", description: "Formal and casual shirts", image: null },
          { name: "Trousers", slug: "men-trousers", description: "Chinos, trousers, and pants", image: null },
          { name: "Shoes", slug: "men-shoes", description: "Sneakers, formals, and sandals", image: null },
        ],
      },
      {
        name: "Women",
        slug: "women",
        description: "Women's clothing",
        image: null,
        children: [
          { name: "Tops", slug: "women-tops", description: "Blouses, tees, and crop tops", image: null },
          { name: "Dresses", slug: "women-dresses", description: "Casual and formal dresses", image: null },
          { name: "Ethnic Wear", slug: "women-ethnic", description: "Sarees, kurtas, and lehengas", image: null },
          { name: "Shoes", slug: "women-shoes", description: "Heels, flats, and sneakers", image: null },
        ],
      },
      {
        name: "Kids",
        slug: "kids",
        description: "Clothing for boys and girls",
        image: null,
        children: [
          { name: "Boys", slug: "kids-boys", description: "Clothing for boys", image: null },
          { name: "Girls", slug: "kids-girls", description: "Clothing for girls", image: null },
        ],
      },
    ],
  },

  // ── Home & Kitchen ────────────────────────────────────────────────────────
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Everything for your home",
    image: null,
    children: [
      {
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        description: "Mixers, microwaves, and more",
        image: null,
        children: [
          { name: "Mixer Grinders", slug: "mixer-grinders", description: "Blenders and mixer grinders", image: null },
          { name: "Microwaves", slug: "microwaves", description: "Microwave ovens", image: null },
          { name: "Air Fryers", slug: "air-fryers", description: "Electric air fryers", image: null },
        ],
      },
      {
        name: "Furniture",
        slug: "furniture",
        description: "Sofas, tables, beds, and storage",
        image: null,
        children: [
          { name: "Sofas", slug: "sofas", description: "Sofas and couches", image: null },
          { name: "Beds", slug: "beds", description: "Beds and mattresses", image: null },
          { name: "Study Tables", slug: "study-tables", description: "Desks and study tables", image: null },
        ],
      },
      {
        name: "Decor",
        slug: "decor",
        description: "Lamps, art, and home accessories",
        image: null,
      },
    ],
  },

  // ── Sports & Fitness ──────────────────────────────────────────────────────
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Gear for every sport and workout",
    image: null,
    children: [
      { name: "Gym Equipment", slug: "gym-equipment", description: "Dumbbells, barbells, and benches", image: null },
      { name: "Yoga", slug: "yoga", description: "Mats, blocks, and accessories", image: null },
      { name: "Cricket", slug: "cricket", description: "Bats, balls, and protective gear", image: null },
      { name: "Running", slug: "running", description: "Running shoes and apparel", image: null },
    ],
  },

  // ── Books ─────────────────────────────────────────────────────────────────
  {
    name: "Books",
    slug: "books",
    description: "Fiction, non-fiction, and educational",
    image: null,
    children: [
      { name: "Fiction", slug: "fiction", description: "Novels and short stories", image: null },
      { name: "Non-Fiction", slug: "non-fiction", description: "Biographies, self-help, and more", image: null },
      { name: "Academic", slug: "academic", description: "Textbooks and study material", image: null },
      { name: "Children's Books", slug: "childrens-books", description: "Books for kids", image: null },
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