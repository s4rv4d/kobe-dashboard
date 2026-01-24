import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    // Forward cookie to backend if present
    const cookie = request.cookies.get("kobe_auth")?.value;

    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: cookie ? { Cookie: `kobe_auth=${cookie}` } : {},
    });

    // Clear cookie on our response (first-party)
    const response = NextResponse.json({ success: true });
    response.cookies.delete("kobe_auth");

    return response;
  } catch (error) {
    console.error("Auth logout proxy error:", error);
    // Still clear cookie even if backend fails
    const response = NextResponse.json({ success: true });
    response.cookies.delete("kobe_auth");
    return response;
  }
}
