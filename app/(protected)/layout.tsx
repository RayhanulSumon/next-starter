import { getCurrentUser } from "@/app/actions/auth/getCurrentUser";
import ProtectedLayoutClient from "./ProtectedLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUserResponse = await getCurrentUser();
  return (
    <ProtectedLayoutClient initialUser={initialUserResponse.data}>
      {children}
    </ProtectedLayoutClient>
  );
}