import { Metadata } from "next";
import GoogleCallbackClient from "./GoogleCallbackClient";

export const metadata: Metadata = {
  title: "Google Authentication | Your App",
  description: "Completing Google authentication",
  robots: "noindex, nofollow", // Prevent indexing of callback pages
};

export default async function GoogleCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;

  console.log("[GoogleCallbackPage] Rendering with searchParams:", !!params.token, !!params.error);

  return <GoogleCallbackClient token={params.token} error={params.error} />;
}