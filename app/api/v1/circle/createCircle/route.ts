import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route"; // Ensure this is the correct import for your auth options
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
  
    const {  center, radius, type } = await req.json();


    const session = await getServerSession(options);
  

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
//@ts-expect-error
    const {userId} = jwt.decode(session.user.accessToken) 

    if (!userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

 
    if ( !center || !radius || !type) {
      return NextResponse.json(
        { error: "Email, center, radius, and type are required" },
        { status: 400 }
      );
    }


    const roundedCenter = {
      lat: parseFloat(center.lat.toFixed(15)),
      lng: parseFloat(center.lng.toFixed(15)),
    };
    const roundedRadius = parseFloat(radius.toFixed(15));


    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: Number(userId), 
        circle: {
          create: {
            center: roundedCenter,
            radius: roundedRadius,
          },
        },
      },
      include: {
        circle: true, // Include the circle in the response
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving circle:", error);
    return NextResponse.json(
      //@ts-expect-error
      { error: error.message || "Failed to save circle" },
      { status: 500 }
    );
  }
}