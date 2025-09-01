import { NextRequest, NextResponse } from "next/server";
import { googleCallbackAction } from "@/app/actions/auth/googleCallbackAction";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const result = await googleCallbackAction(token);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[API google-callback-action] Error:", e);
    return NextResponse.json(
      { success: false, redirect: "/login?error=google_auth_failed" },
      { status: 500 }
    );
  }
}