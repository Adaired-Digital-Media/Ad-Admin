import { auth } from "@/auth";
import Index from "../shared/dashboard";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    throw new Error("User session is not available.");
  }
  return <Index session={session}/>;
}
