import { NextRequest, NextResponse } from "next/server";
import { Priority, Status } from "@/generated/prisma";
import z from "zod";
import { auth } from "@clerk/nextjs/server";

import {prisma} from "@/lib/prisma"

const taskSchema = z.object({
    title: z.string().min(1,'Title is required'),
    description: z.string().max(500).optional(),
    dueData: z.string().datetime().optional(),
    priority: z.enum(['LOW','MEDIUM','HIGH']).default('MEDIUM'),
    status: z.enum(['PENDING','IN_PROGRESS','COMPLETED']).default('PENDING'),


})

export async function GET(req:NextRequest){

    try{
        const { userId } = await auth();
        if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401});

        const url = new URL(req.url);
        const status = url.searchParams.get('status') as Status | undefined;
        const priority = url.searchParams.get('priority') as Priority | undefined
        
        const tasks = await prisma.task.findMany({
            where : {
                user: { clerkId: userId },
                status: status?? undefined,
                priority: priority?? undefined,
            },
            select : {id:true, title:true, description:true, dueDate:true, priority:true, status:true, createdAt:true, updatedAt:true}
        });

        return NextResponse.json({data:tasks},{status:200})


    }
    catch(error){
        console.error('GET tasks error', error);
        return NextResponse.json({error:'Internal Server Error'},{status:500});

    }

}

export async function POST(req:NextRequest){

    try{
        const {userId} = await auth();
        if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401});

        const body = await req.json();
        const validated = taskSchema.safeParse(body);
        if (!validated.success) return NextResponse.json({error:validated.error.issues},{status:400})

        const user = await prisma.user.findUnique({where:{clerkId:userId}});
        if (!user) return NextResponse.json({error:'User not found'},{status:404})

        const task = await prisma.task.create({
            data: {
                ...validated.data,
                dueDate: validated.data.dueData? new Date(validated.data.dueData) : undefined,
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