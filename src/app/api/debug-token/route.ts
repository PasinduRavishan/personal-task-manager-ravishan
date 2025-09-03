import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const token = await getToken();
  console.log("Clerk JWT:", token);

  return NextResponse.json({ userId, token });
}
