import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
  }
  NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};
