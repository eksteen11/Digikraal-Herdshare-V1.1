import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function AppPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  // Redirect based on role
  if (role === "Admin") {
    redirect("/app/admin");
  } else if (role === "Farmer" || role === "Partner") {
    redirect("/app/farmer");
  } else {
    redirect("/app/investor");
  }
}

