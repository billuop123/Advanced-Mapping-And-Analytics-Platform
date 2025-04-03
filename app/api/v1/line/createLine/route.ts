import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { LatLng } from "leaflet";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";

import jwt from "jsonwebtoken"
const roundTo10DecimalPlaces = (num:Number) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
    // Extract the email and coordinates from the request body

    
    
        const session = await getServerSession(options);
      
    
        if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    const {  coords, type } = await req.json();

    if (!coords || !type) {
      return NextResponse.json(
        { error: "coordinates, and type are required" },
        { status: 400 }
      );
    }

    // Round the coordinates to 10 decimal places
    const roundedCoords = coords.map((coord:any) => ({
      lat: roundTo10DecimalPlaces(coord.lat),
      lng: roundTo10DecimalPlaces(coord.lng),
    }));

    // Find the user by email
  

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new shape with a polyline
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: userId,
        polyline: {
          create: {
            coords: roundedCoords, // Store the rounded coordinates as JSON
          },
        },
      },
      include: {
        polyline: true, // Include the polyline in the response
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving polyline:", error);
    return NextResponse.json(
      { error: "Failed to save polyline" },
      { status: 500 }
    );
  }
}
