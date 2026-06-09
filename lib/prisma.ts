import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (
  process.env.NODE_ENV !== "production" &&
  (!prisma.account || !prisma.user || !prisma.session)
) {
  throw new Error(
    "Prisma client is missing NextAuth model delegates. Run `npx.cmd prisma generate` and restart `next dev`."
  );
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
