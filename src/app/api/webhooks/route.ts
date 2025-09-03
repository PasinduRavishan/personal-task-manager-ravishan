import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";



export async function POST(req: NextRequest) {
  const secretKey = process.env.CLERK_WEBHOOK_SECRET_KEY;
  console.log("Running webhook post");
  if (!secretKey) {
    console.error("Missing CLERK_WEBHOOK_SECRET_KEY");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("svix-signature");
  const timestamp = req.headers.get("svix-timestamp");
  const id = req.headers.get("svix-id");

  if (!signature || !timestamp || !id) {
    console.error("Missing required webhook headers");
    return NextResponse.json({ error: "Missing required headers" }, { status: 400 });
  }

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

  try {
    console.log("Processing webhook event:", event.type);
    console.log("Event data:", JSON.stringify(event.data, null, 2));
    
    switch (event.type) {
      case "user.created":
        const { 
          id: clerkId, 
          first_name, 
          last_name,
          username: clerkUsername,
          email_addresses 
        } = event.data;
        
        if (!email_addresses || email_addresses.length === 0) {
          console.error("No email addresses found for user creation");
          return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }

        const email = email_addresses[0].email_address;
        
        
        let username = null;
        if (clerkUsername) {
          username = clerkUsername;
        } else if (first_name && last_name) {
          username = `${first_name} ${last_name}`;
        } else if (first_name) {
          username = first_name;
        } else {
          
          username = email.split('@')[0];
        }

        try {
          
          await prisma.user.upsert({
            where: { clerkId },
            update: {
              username,
              email,
              updatedAt: new Date(),
            },
            create: {
              clerkId,
              username,
              email,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          console.log(`Upserted user with clerkId: ${clerkId}`);
        } catch (error: any) {
          
          if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            console.log(`Email already exists, updating user by email: ${email}`);
            await prisma.user.updateMany({
              where: { email },
              data: {
                clerkId, 
                username,
                updatedAt: new Date(),
              },
            });
            console.log(`Updated user by email: ${email}`);
          } else {
            
            throw error;
          }
        }
        console.log(`User created/updated: ${clerkId} with username: ${username}`);
        break;

      case "user.updated":
        const { 
          id: updatedClerkId, 
          first_name: updatedFirstName,
          last_name: updatedLastName,
          username: updatedClerkUsername,
          email_addresses: updatedEmails 
        } = event.data;
        
        if (!updatedEmails || updatedEmails.length === 0) {
          console.error("No email addresses found for user update");
          return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
        }

        const updatedEmail = updatedEmails[0].email_address;
        
        
        let updatedUsername = null;
        if (updatedClerkUsername) {
          updatedUsername = updatedClerkUsername;
        } else if (updatedFirstName && updatedLastName) {
          updatedUsername = `${updatedFirstName} ${updatedLastName}`;
        } else if (updatedFirstName) {
          updatedUsername = updatedFirstName;
        } else {
          updatedUsername = updatedEmail.split('@')[0];
        }

        await prisma.user.update({
          where: { clerkId: updatedClerkId },
          data: {
            username: updatedUsername,
            email: updatedEmail,
            updatedAt: new Date(),
          },
        });
        console.log(`User updated: ${updatedClerkId} with username: ${updatedUsername}`);
        break;

      case "user.deleted":
        await prisma.user.delete({
          where: { clerkId: event.data.id },
        });
        console.log(`User deleted: ${event.data.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
  }

  


  return NextResponse.json({ success: true }, { status: 200 });
}