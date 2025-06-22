import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
  const { searchParams } = new URL(res.url);

  const name = searchParams.get("name");
  const userId = searchParams.get("userId");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!name || !userId || !accessToken || !refreshToken)
    throw new Error("Google oath failed");
  await createSession({
    user: {
      id: userId,
      name,
    },
    accessToken,
    refreshToken,
  });
  redirect("/");
}
