console.log("[GoogleCallbackPage] FILE LOADED");
import GoogleCallbackClient from "./GoogleCallbackClient";

export default async function GoogleCallbackPage({
  searchParams,
}: {
  searchParams: { token?: string; error?: string };
}) {
  console.log("[GoogleCallbackPage] Rendering with searchParams:", searchParams);

  return <GoogleCallbackClient token={searchParams.token} error={searchParams.error} />;
}