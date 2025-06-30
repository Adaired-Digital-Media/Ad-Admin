import { auth } from "@/auth";
import Index from "../shared/dashboard";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect(routes.auth.signIn);
  }
  return <Index session={session!} />;
}
