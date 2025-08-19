import { getCurrentUser } from "@/app/actions/auth/getCurrentUser";
import ProtectedLayoutClient from "./ProtectedLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getCurrentUser();
  return <ProtectedLayoutClient initialUser={initialUser}>{children}</ProtectedLayoutClient>;
}