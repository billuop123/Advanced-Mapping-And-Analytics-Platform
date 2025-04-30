import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route"; 
import jwt from "jsonwebtoken";
import { prisma } from "@/app/services/prismaClient";

export async function GET(req:Request){
    try {
        const session = await getServerSession(options);
  
        if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const {userId} = jwt.decode(session.user.accessToken) as { userId: number }

        if(!userId){
            return NextResponse.json({message:"User not found"},{status:404})
        }

        const shapes=await prisma.shape.findMany({
            where:{
                userId:userId
            }
        })

        const totalShapes=shapes.length
        return NextResponse.json({
            totalShapes,
            shapes
        }, { status: 200 })
        
    } catch (error) {
        console.error("Error fetching single stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch user statistics" },
            { status: 500 }
        )
    }
}