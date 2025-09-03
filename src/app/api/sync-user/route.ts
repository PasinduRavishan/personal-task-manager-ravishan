import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        // console.log("[Sync-User] Starting sync process for userId:", userId);
        
        if (!userId) {
            // console.log("[Sync-User] No userId found");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        
        const clerkUser = await currentUser();
        // console.log("[Sync-User] Clerk user data:", {
        //     id: clerkUser?.id,
        //     username: clerkUser?.username,
        //     firstName: clerkUser?.firstName,
        //     lastName: clerkUser?.lastName,
        //     emailCount: clerkUser?.emailAddresses?.length
        // });
        
        if (!clerkUser) {
            console.log("❌ [Sync-User] No clerkUser found");
            return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
        }
        
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            console.log("❌ [Sync-User] No email found");
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }
        
        // Determine username with fallback logic
        let username = null;
        if (clerkUser.username) {
            username = clerkUser.username;
        } else if (clerkUser.firstName && clerkUser.lastName) {
            username = `${clerkUser.firstName} ${clerkUser.lastName}`;
        } else if (clerkUser.firstName) {
            username = clerkUser.firstName;
        } else {
            username = email.split('@')[0];
        }
        
        // console.log("[Sync-User] Generated username:", username, "Email:", email);
        
        // Try to find existing user first
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { clerkId: userId },
                    { email: email }
                ]
            }
        });
        
        // console.log("[Sync-User] Database lookup result:", {
        //     existingUserFound: !!existingUser,
        //     existingUserId: existingUser?.id,
        //     existingUserClerkId: existingUser?.clerkId,
        //     existingUserEmail: existingUser?.email
        // });
        
        if (existingUser) {
            //console.log("[Sync-User] Updating existing user");
            // Update existing user
            const updatedUser = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    clerkId: userId, 
                    username,
                    email,
                    updatedAt: new Date(),
                },
            });
            
            // console.log("[Sync-User] User updated successfully:", updatedUser.id);
            return NextResponse.json({ 
                data: updatedUser, 
                message: 'User synced successfully' 
            }, { status: 200 });
        } else {
            // console.log("[Sync-User] Creating new user");
            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    username,
                    email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            
            // console.log("[Sync-User] New user created successfully:", newUser.id);
            return NextResponse.json({ 
                data: newUser, 
                message: 'User created successfully' 
            }, { status: 201 });
        }
        
    } catch (error) {
        // console.error('[Sync-User] Error occurred:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
