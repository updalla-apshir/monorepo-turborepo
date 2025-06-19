import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  await deleteSession();
  revalidatePath("/");
  return NextResponse.redirect(new URL("/", request.nextUrl));
};
