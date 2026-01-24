import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function proxyRequest(
  request: NextRequest,
  method: string
): Promise<NextResponse> {
  try {
    const token = request.cookies.get("kobe_auth")?.value;
    const path = request.nextUrl.pathname.replace(/^\/api/, "");
    const search = request.nextUrl.search;

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Forward content-type for POST/PUT
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Forward body for POST/PUT/DELETE with body
    if (method !== "GET" && method !== "HEAD") {
      const bodyContentType = request.headers.get("content-type") || "";

      if (bodyContentType.includes("multipart/form-data")) {
        // Handle file uploads - pass through the body as-is
        const formData = await request.formData();
        fetchOptions.body = formData;
        // Remove content-type so fetch can set it with boundary
        delete (headers as Record<string, string>)["Content-Type"];
      } else if (bodyContentType.includes("application/json")) {
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      }
    }

    const backendRes = await fetch(
      `${BACKEND_URL}${path}${search}`,
      fetchOptions
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error(`Proxy ${method} error:`, error);
    return NextResponse.json(
      { success: false, error: "Request failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}
