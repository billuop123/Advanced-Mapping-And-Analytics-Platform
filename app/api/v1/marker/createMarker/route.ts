import { options } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
export async function POST(req: NextRequest) {
  try {
     const session = await getServerSession(options);
                  
                
                    if (!session) {
                      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                    }
               
                    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    const { newLocation } = await req.json();
   

  


    if (!userId) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }

    const newMarker = await prisma.location.create({
      data: {
        userId: userId,
        latitude: newLocation.latitude, 
        longitude: newLocation.longitude, 
        description: newLocation.description, 
        type: newLocation.type,
      },
    });


    return NextResponse.json({ newMarker }, { status: 201 });
  } catch (err) {
    console.error("Error creating location:", err);
    return NextResponse.json(
      { message: "An error occurred while creating the location" },
      { status: 500 }
    );
  }
}
