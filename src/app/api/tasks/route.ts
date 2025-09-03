import { NextRequest, NextResponse } from "next/server";
import { Priority, Status } from "@/generated/prisma";
import z from "zod";
import { auth } from "@clerk/nextjs/server";

import {prisma} from "@/lib/prisma"

const taskSchema = z.object({
    title: z.string().min(1,'Title is required'),
    description: z.string().max(500).optional(),
    dueDate: z.string().optional().transform(val => val && val.trim() !== "" ? new Date(val) : undefined),
    priority: z.enum(['LOW','MEDIUM','HIGH']).default('MEDIUM'),
    status: z.enum(['PENDING','IN_PROGRESS','COMPLETED']).default('PENDING'),


})

export async function GET() {
  try {
    const { userId } = await auth();
    // console.log("[GET /api/tasks] User ID from Clerk:", userId);

    if (!userId) {
    //   console.log("[GET /api/tasks] No user ID found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { tasks: true }
    });

    // console.log("[GET /api/tasks] Database lookup result:", {
    //   userFound: !!user,
    //   userId: user?.id,
    //   clerkId: user?.clerkId,
    //   tasksCount: user?.tasks?.length || 0
    // });

    if (!user) {
    //   console.log("[GET /api/tasks] User not found in database with clerkId:", userId);
      
      // Let's also check if any users exist at all
      const allUsers = await prisma.user.findMany({
        select: { id: true, clerkId: true, email: true, createdAt: true }
      });
    //   console.log("[GET /api/tasks] All users in database:", allUsers);
      
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // console.log("[GET /api/tasks] User found:", user.id, "Tasks count:", user.tasks.length);
    return NextResponse.json({ tasks: user.tasks });
  } catch (error) {
    // console.error("[GET /api/tasks] Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req:NextRequest){

    try{
        const {userId} = await auth();
        
        if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401});

        const body = await req.json();
        const validated = taskSchema.safeParse(body);
        
        if (!validated.success) return NextResponse.json({error:validated.error.issues},{status:400})

        const user = await prisma.user.findUnique({where:{clerkId:userId!}});
        
        if (!user) {
            return NextResponse.json({error:'User not found. Please refresh the page to sync your account.'},{status:404});
        }

        const task = await prisma.task.create({
            data: {
                ...validated.data,
                userId:user.id,
            },
        })

        if (task && task.id) {
            await prisma.taskLog.create({
                data:{action:'CREATED', userId:user.id, taskId:task.id}
            })
        }

        return NextResponse.json({data:task, message:'Task Created'},{status:201})

    }
    catch(error){
        console.error('POST task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

    }



}