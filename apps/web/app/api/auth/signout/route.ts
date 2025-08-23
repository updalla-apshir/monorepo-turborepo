import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) {
    await deleteSession();
  }
  revalidatePath("/");
  return NextResponse.redirect(new URL("/", request.nextUrl));
};
