import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    // Create response with same data
    const response = NextResponse.json(data, { status: backendRes.status });

    // Extract token from backend Set-Cookie and set as first-party cookie
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie && data.success) {
      // Parse token from "kobe_auth=<token>; ..." format
      const tokenMatch = setCookie.match(/kobe_auth=([^;]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        response.cookies.set("kobe_auth", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax", // First-party cookie can use lax
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
          path: "/",
        });
      }
    }

    return response;
  } catch (error) {
    console.error("Auth verify proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
