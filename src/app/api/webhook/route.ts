import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

export async function POST(req: NextRequest) {
  const secretKey = process.env.CLERK_WEBHOOK_SECRET_KEY; // Set in .env
  if (!secretKey) throw new Error("Missing CLERK_WEBHOOK_SECRET_KEY");

  const body = await req.text();
  const signature = req.headers.get("svix-signature") as string;
  const timestamp = req.headers.get("svix-timestamp") as string;
  const id = req.headers.get("svix-id") as string;

  const wh = new Webhook(secretKey);
  let event: any;

  try {
    event = wh.verify(body, {
      "svix-signature": signature,
      "svix-timestamp": timestamp,
      "svix-id": id,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, first_name, email_addresses } = event.data;
    const email = email_addresses[0].email_address;

    await prisma.user.create({
      data: {
        clerkId: id,
        username: first_name || null,
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}