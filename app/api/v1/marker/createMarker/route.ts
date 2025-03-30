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
                //@ts-expect-error
                    const {userId} = jwt.decode(session.user.accessToken) 
    const { newLocation } = await req.json();
   
    // Find the user by email
  

    // If no user is found, return an error response
    if (!userId) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }

    // Create a new location in the database
    const newMarker = await prisma.location.create({
      data: {
        userId: userId,
        latitude: newLocation.latitude, // Access latitude directly
        longitude: newLocation.longitude, // Access longitude directly
        description: newLocation.description, // Use name or description
        type: newLocation.type,
      },
    });

    // Return the newly created location
    return NextResponse.json({ newMarker }, { status: 201 });
  } catch (err) {
    console.error("Error creating location:", err);
    return NextResponse.json(
      { message: "An error occurred while creating the location" },
      { status: 500 }
    );
  }
}
