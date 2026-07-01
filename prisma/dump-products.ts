import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Fetching products from database...");
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          slug: true,
        },
      },
    },
  });

  console.log(`Found ${products.length} products.`);

  // Map products to seedable objects
  const productSeeds = products.map((p) => {
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price.toString(),
      salePrice: p.salePrice ? p.salePrice.toString() : null,
      stockQty: p.stockQty,
      images: p.images,
      tags: p.tags,
      categorySlug: p.category?.slug || null,
    };
  });

  // Generate seed-products.ts code
  const fileContent = `import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const products = ${JSON.stringify(productSeeds, null, 2)};

async function main() {
  console.log("Seeding products...");
  
  for (const item of products) {
    const { categorySlug, ...productData } = item;
    
    // Find category ID by categorySlug if present
    let categoryId: string | null = null;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });
      if (cat) {
        categoryId = cat.id;
      }
    }
    
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        salePrice: productData.salePrice,
        stockQty: productData.stockQty,
        images: productData.images || [],
        tags: productData.tags,
        categoryId,
      },
      create: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        salePrice: productData.salePrice,
        stockQty: productData.stockQty,
        images: productData.images || [],
        tags: productData.tags,
        categoryId,
      }
    });
  }
  
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
`;

  const outputPath = path.join(__dirname, "seed-products.ts");
  fs.writeFileSync(outputPath, fileContent, "utf-8");
  console.log(`Successfully generated seed file at: ${outputPath}`);
}

main()
  .catch((e) => {
    console.error("Error dumping products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
