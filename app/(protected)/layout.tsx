import { getCurrentUser } from "@/app/actions/auth/getCurrentUser";
import { AuthProvider } from "@/context/auth-context";
import ProtectedLayoutClient from "./ProtectedLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUserResponse = await getCurrentUser();
  return (
    <AuthProvider initialUser={initialUserResponse.data}>
      <ProtectedLayoutClient initialUser={initialUserResponse.data}>
        {children}
      </ProtectedLayoutClient>
    </AuthProvider>
  );
}