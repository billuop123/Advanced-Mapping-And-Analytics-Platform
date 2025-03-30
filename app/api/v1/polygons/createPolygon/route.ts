import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function POST(req: Request) {
  try {
    // Extract the email, coordinates, and type from the request body
    const session = await getServerSession(options);
                          
                        
                            if (!session) {
                              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                            }
                        //@ts-expect-error
                            const {userId} = jwt.decode(session.user.accessToken) 
    const {  coords, type } = await req.json();

    if (!coords || !type) {
      return NextResponse.json(
        { error: "Email, coordinates, and type are required" },
        { status: 400 }
      );
    }

    // Round the coordinates to 15 decimal places
    let roundedCoords = coords.map((polygon:any) =>
      polygon.map((point:any) => ({
        lat: parseFloat(point.lat.toFixed(15)),
        lng: parseFloat(point.lng.toFixed(15)),
      }))
    );
    roundedCoords = roundedCoords.flat();
    // Find the user by email
   

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new shape with a polygon
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: userId,
        polygon: {
          create: {
            coords: roundedCoords, // Use the rounded coordinates
          },
        },
      },
      include: {
        polygon: true, // Include the polygon in the response
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving polygon:", error);
    return NextResponse.json(
      { error: "Failed to save polygon" },
      { status: 500 }
    );
  }
}
