console.log("[GoogleCallbackPage] FILE LOADED");
import { googleCallbackAction } from "@/app/actions/auth/googleCallbackAction";

export default async function GoogleCallbackPage({
  searchParams,
}: {
  searchParams: { token?: string; error?: string };
}) {
  console.log("[GoogleCallbackPage] SSR searchParams:", searchParams);
  const token = searchParams.token ?? null;
  const error = searchParams.error ?? null;
  if (error) {
    console.error("[GoogleCallbackPage] SSR error param present:", error);
  }
  // Call the server action to set the cookie and handle redirect
  await googleCallbackAction(token);
  // Fallback UI (should never be seen due to redirect)
  return (
    <div className="flex h-screen items-center justify-center">
      <span className="text-muted-foreground text-lg">Logging you in with Google (server)...</span>
    </div>
  );
}