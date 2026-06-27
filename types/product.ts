import { Prisma } from '@/app/generated/prisma/client';

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export interface SerializedProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stockQty: number;
  images: Prisma.JsonValue;
  tags: string[];
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

