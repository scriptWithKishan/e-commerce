import "dotenv/config";
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

const products = [
  {
    "name": "The Classic Tan Leather Oxford Shoe",
    "slug": "classic-tan-leather-oxford-shoe",
    "description": "Step out in style with these timeless tan leather Oxford shoes. Meticulously crafted from high-quality leather, they feature a sleek, professional look that's perfect for work or special occasions. The rich tan color and refined stitching add a touch of sophistication to any outfit. These durable and comfortable oxfords are a staple for every man's wardrobe.",
    "price": "9232",
    "salePrice": "8265",
    "stockQty": 72,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782896514/e-commerce/ibyexzqcwutyeijdfdw0.png",
        "altText": "Gemini_Generated_Image_furbdjfurbdjfurb.png",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782896513/e-commerce/sjl0am0tgxp3q858tauk.png",
        "altText": "Gemini_Generated_Image_r52vv1r52vv1r52v.png",
        "isPrimary": false
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782896515/e-commerce/dwygyxtinpnqdlq1nt1n.png",
        "altText": "Gemini_Generated_Image_rbhqpprbhqpprbhq.png",
        "isPrimary": false
      }
    ],
    "tags": [
      "men's dress shoes",
      "oxford shoes",
      "leather shoes",
      "tan shoes",
      "classic style",
      "professional wear",
      "men's fashion"
    ],
    "categorySlug": "footwear"
  },
  {
    "name": "Apex Streak Carbon Full-Face Helmet (Cyan & Orange Edition)",
    "slug": "apex-streak-carbon-full-face-helmet-cyan-orange-edition",
    "description": "Engineered for riders who demand both high-octane style and elite performance, the Apex Streak combines a premium matte carbon-fiber weave texture with striking aerodynamic geometry. Featuring an aggressive, low-profile chin bar and sharp, contrast-blocking racing graphics in vibrant cyan and electric orange, this full-face helmet is optimized for stability at high speeds. Multiple front intake vents ensure maximum airflow through the internal EPS liner, while the scratch-resistant, wide-view visor port offers an uncompromised field of vision on the track or the street.",
    "price": "22984",
    "salePrice": "19832",
    "stockQty": 8,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782897057/e-commerce/qu797rmucdvxw5vaqrao.png",
        "altText": "Gemini_Generated_Image_p83bvpp83bvpp83b.png",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782897056/e-commerce/wvbjafk7rogrka2nixno.png",
        "altText": "Gemini_Generated_Image_1lcssz1lcssz1lcs.png",
        "isPrimary": false
      }
    ],
    "tags": [
      "motorcyclehelmet",
      "fullfacehelmet",
      "carbonfiberstyle",
      "racinggear",
      "ridersafety",
      "aerodesign"
    ],
    "categorySlug": "bike-accessories"
  },
  {
    "name": "AeroDyne 'Apex' Adventure Riding Jacket",
    "slug": "aerodyne-apex-adventure-riding-jacket",
    "description": "The AeroDyne 'Apex' Adventure Riding Jacket is the definitive gear for the modern explorer. Engineered to handle the rigors of multi-day expeditions and unpredictable weather, this jacket seamlessly blends aggressive styling with unparalleled functionality.",
    "price": "48292",
    "salePrice": "44932",
    "stockQty": 12,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782897610/e-commerce/le1ppramrvtvcpsykmff.png",
        "altText": "Gemini_Generated_Image_dp6q78dp6q78dp6q.png",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782897609/e-commerce/uo6ff23c3sfzexemuivb.png",
        "altText": "Gemini_Generated_Image_tru270tru270tru2.png",
        "isPrimary": false
      }
    ],
    "tags": [
      "aerodyne",
      "adventurejacket",
      "motorcyclegear",
      "endurogear",
      "ridingessentials"
    ],
    "categorySlug": "bike-accessories"
  },
  {
    "name": "The Heritage Craft Artisan Gardening Tool Set (4-Piece Bundle)",
    "slug": "the-heritage-craft-artisan-gardening-tool-set-4-piece-bundle",
    "description": "Bring timeless quality and rustic charm to your daily garden routine with our Heritage Craft Artisan Gardening Tool Set. Beautifully presented in a handcrafted wooden trug basket, this premium collection features essential, heavy-duty tools designed for both durability and comfort.",
    "price": "20382",
    "salePrice": "17327",
    "stockQty": 83,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782899489/e-commerce/dhto5bt9qxnbpwyassjw.png",
        "altText": "Gemini_Generated_Image_qewa7tqewa7tqewa.png",
        "isPrimary": true
      }
    ],
    "tags": [
      "gardening tools",
      "artisan garden set",
      "premium trowel",
      "hand cultivator",
      "pruning shears",
      "wooden garden trug"
    ],
    "categorySlug": "tools"
  },
  {
    "name": "The Heritage Garden Shampoo - Rosemary & Sage",
    "slug": "the-heritage-garden-shampoo-rosemary-sage",
    "description": "Discover the rejuvenating benefits of our Heritage Garden Shampoo, a sophisticated blend crafted to deeply cleanse and revitalize your hair and scalp. Infused with the aromatic essence of natural Rosemary and Sage, this formula offers a refreshing and invigorating experience that will elevate your daily routine.",
    "price": "2433",
    "salePrice": "2143",
    "stockQty": 54,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782901147/e-commerce/xf0djxbi2zmts5clz1ms.png",
        "altText": "Gemini_Generated_Image_9v88gz9v88gz9v88.png",
        "isPrimary": true
      }
    ],
    "tags": [
      "rosemary & sage shampoo",
      "natural hair care",
      "botanical shampoo",
      "luxury shampoo",
      "invigorating scalp care"
    ],
    "categorySlug": "bath-body"
  },
  {
    "name": "AURÉLIA Blossom Eau De Parfum (50ml)",
    "slug": "aurlia-blossom-eau-de-parfum-50ml",
    "description": "Indulge your senses in the timeless elegance of Aurélia Blossom, a sophisticated fragrance crafted for the modern individual. Housed in an exquisitely faceted, heavy-glass bottle featuring striking gold accents, this perfume is as much a statement piece for your vanity as it is a signature scent.",
    "price": "6324",
    "salePrice": "5232",
    "stockQty": 53,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782902148/e-commerce/dsks0bbufe2wcfgfha7m.png",
        "altText": "Gemini_Generated_Image_1q5ney1q5ney1q5n.png",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782902146/e-commerce/q9nzdhji0mbzrhv9cf0g.png",
        "altText": "Gemini_Generated_Image_pzjp8rpzjp8rpzjp.png",
        "isPrimary": false
      }
    ],
    "tags": [
      "perfume",
      "eau de parfum",
      "fragrance",
      "signature scent",
      "aurelia blossom"
    ],
    "categorySlug": "fragrance"
  },
  {
    "name": "Canon EOS R5 Mirrorless Camera with 24-70mm f/2.8L IS USM Lens",
    "slug": "canon-eos-r5-mirrorless-camera-with-24-70mm-f28l-is-usm-lens",
    "description": "Capture unmatched detail and professional-grade video with this powerful, full-frame mirrorless camera setup. Featuring an advanced autofocus system, incredible image stabilization, and a robust build, it is paired with a versatile 24-70mm f/2.8L series lens—making it the ultimate tool for commercial, portrait, and landscape photographers who demand perfection.",
    "price": "153324",
    "salePrice": "132532",
    "stockQty": 53,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782904013/e-commerce/owoofxiisurqwwxabugs.png",
        "altText": "Gemini_Generated_Image_ydpmjzydpmjzydpm.png",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782904012/e-commerce/txpsa6u8jb2nof5hgueu.png",
        "altText": "Gemini_Generated_Image_cyd22mcyd22mcyd2.png",
        "isPrimary": false
      }
    ],
    "tags": [
      "dslr & mirrorless",
      "professional camera",
      "canon eos",
      "4k video",
      "photography gear"
    ],
    "categorySlug": "cameras"
  },
  {
    "name": "Apple M2 Pro, Aluminum body with 64GB RAM ",
    "slug": "apple-m2-pro-aluminum-body-with-64gb-ram",
    "description": "A premium aluminum-bodied device powered by the Apple M2 Pro chip with 64GB of unified memory, delivering exceptional performance for demanding professional workflows, multitasking, and creative applications.\n",
    "price": "194323",
    "salePrice": "183722",
    "stockQty": 92,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905392/e-commerce/q8jjs4nxpcd3daxtgndj.jpg",
        "altText": "Generated Image July 01, 2026 - 4_54PM.jpg",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905392/e-commerce/ajeq425uiu92pgunljdi.jpg",
        "altText": "Generated Image July 01, 2026 - 4_54PM (1).jpg",
        "isPrimary": false
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905392/e-commerce/xswenbkpfglnujrgapl3.jpg",
        "altText": "Generated Image July 01, 2026 - 4_54PM (2).jpg",
        "isPrimary": false
      }
    ],
    "tags": [
      "laptop",
      "mac",
      "apple",
      "64gb ram",
      "pc"
    ],
    "categorySlug": "laptops"
  },
  {
    "name": "Nova X1 Pro 5G",
    "slug": "nova-x1-pro-5g",
    "description": "A sleek, high-performance 5G smartphone featuring a vibrant AMOLED display, advanced AI-powered cameras, long-lasting battery life, and fast charging for seamless everyday use.",
    "price": "83432",
    "salePrice": "73234",
    "stockQty": 34,
    "images": [
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905900/e-commerce/txivhu52hbfsdopkspo0.jpg",
        "altText": "Generated Image July 01, 2026 - 5_04PM.jpg",
        "isPrimary": true
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905900/e-commerce/f4cka0czd0jnljgbviat.jpg",
        "altText": "Generated Image July 01, 2026 - 5_04PM (1).jpg",
        "isPrimary": false
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905899/e-commerce/cp6fhimj7anv4opr2f9d.jpg",
        "altText": "Generated Image July 01, 2026 - 5_04PM (2).jpg",
        "isPrimary": false
      },
      {
        "url": "https://res.cloudinary.com/dxvpw3wrz/image/upload/v1782905900/e-commerce/u4zzlax7alfk87khsezw.jpg",
        "altText": "Generated Image July 01, 2026 - 5_04PM (3).jpg",
        "isPrimary": false
      }
    ],
    "tags": [
      "5g",
      "amoled display",
      "ai camera",
      "fast charging",
      "long battery life",
      "android"
    ],
    "categorySlug": "phones"
  }
];

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
