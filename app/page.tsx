"use server"

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Users</h1>
      <p>{JSON.stringify(users, null, 2)}</p>
    </div>
  );
}
