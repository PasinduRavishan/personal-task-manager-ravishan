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

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    // console.log("[GET /api/tasks] User ID from Clerk:", userId);

    if (!userId) {
    //   console.log("[GET /api/tasks] No user ID found catched from route file");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');

    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // console.log("[GET /api/tasks] Database lookup result:", {
    //   userFound: !!user,
    //   userId: user?.id,
    //   clerkId: user?.clerkId,
    // });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    const filters: any = { userId: user.id };
    
    if (statusFilter && ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(statusFilter)) {
      filters.status = statusFilter as Status;
    }
    
    if (priorityFilter && ['LOW', 'MEDIUM', 'HIGH'].includes(priorityFilter)) {
      filters.priority = priorityFilter as Priority;
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });

    // console.log("[GET /api/tasks] User found:", user.id, "Tasks count:", tasks.length, "Filters:", filters);
    return NextResponse.json({ tasks });
  } catch (error) {
    // console.error("[GET /api/tasks] Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req:NextRequest){

    try{
        const {userId} = await auth();
        
        // if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401});

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