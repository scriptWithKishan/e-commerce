import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) return <p>Not logged in</p>;
  return <p>Hello, {session.user?.name}</p>;
}
