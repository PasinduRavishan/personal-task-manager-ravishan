import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import z from "zod";

const updateSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['LOW','MEDIUM','HIGH']).optional(),
    status: z.enum(['PENDING','IN_PROGRESS','COMPLETED']).optional(),

})

export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){

    try{
        const {userId} = await auth();
        if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401})

        const { id } = await params;

        const task = await prisma.task.findUnique({
            where:{id},
            select:{ id: true, title: true, description: true, dueDate: true, priority: true, status: true, userId: true, createdAt: true, updatedAt: true },
        })

        if (!task) return NextResponse.json({error:'Task not found'},{status:404})
        
        const user = await prisma.user.findUnique({
            where : {clerkId:userId},
        })
        if (task.userId !== user?.id) return NextResponse.json({error:'Unauthorized access'},{status:403})

        return NextResponse.json({data:task},{status:200})

    }
    catch(error){
        console.error('GET task error', error);
        return NextResponse.json({error:'Internal Server Error'},{status:500})

    }



}


export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){

    try{
        const {userId} = await auth();
        if (!userId) return NextResponse.json({error:'Unauthorized'},{status:401})
        
        const { id } = await params;
        
        const body = await req.json();
        const validated = updateSchema.safeParse(body);
        if (!validated.success) return NextResponse.json({ error: validated.error.issues }, { status: 400 });
        
        const user = await prisma.user.findUnique({
            where : {clerkId:userId}
        })

        const task = await prisma.task.findUnique({
            where : {id}
        })

        if (!task || task.userId !== user?.id) return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });

        const updatedTask = await prisma.task.update({
            where : {id},
            data:{
                ...validated.data,
                dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : undefined,

            }
        })

        await prisma.taskLog.create({
            data: {action:'UPDATED',userId:user.id, taskId:task.id},
        })

        return NextResponse.json({ data: updatedTask, message: 'Task updated' },{status:200})

    }
    catch(error){
        console.error('PUT task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req:NextRequest, { params }: { params: Promise<{ id: string }> }){

    try{
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        const user = await prisma.user.findUnique({
             where: { clerkId: userId } 
            });

        const task = await prisma.task.findUnique({
             where: { id } 
            });


        if (!task || task.userId !== user?.id) return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });

        await prisma.taskLog.create({
        data: { action: 'DELETED', userId: user.id, taskId: id },
        });

        await prisma.taskLog.deleteMany({ where: { taskId: id } });
        await prisma.task.delete({ where: { id } });

        return NextResponse.json({ message: 'Task deleted' }, { status: 200 });


    }
    catch(error){
        console.error("DELETE task error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });

    }


}