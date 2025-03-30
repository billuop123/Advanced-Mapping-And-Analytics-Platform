import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"

const roundTo10DecimalPlaces = (num:Number) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
       const session = await getServerSession(options);
          
        
            if (!session) {
              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        //@ts-expect-error
            const {userId} = jwt.decode(session.user.accessToken) 
    const {coords } = await req.json();
   
    // Validate input
    if (!coords) {
      return NextResponse.json(
        { error: "Email and coordinates are required" },
        { status: 400 }
      );
    }

    const roundedCoords = coords.map((coord:any) => ({
      lat: roundTo10DecimalPlaces(coord.lat),
      lng: roundTo10DecimalPlaces(coord.lng),
    }));

    console.log("Rounded Coordinates:", roundedCoords);


    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: userId,
        },
      },
    });

    const polyline = polylines.find((line) => {
      //@ts-expect-error
      const dbCoords = line.coords.map((coord) => ({
        lat: roundTo10DecimalPlaces(coord.lat),
        lng: roundTo10DecimalPlaces(coord.lng),
      }));
      return JSON.stringify(dbCoords) === JSON.stringify(roundedCoords);
    });

    if (!polyline) {
      return NextResponse.json({
        error: "Polyline with the specified coordinates not found",
      });
    }

    await prisma.polyline.delete({
      where: {
        id: polyline.id,
      },
    });

    return NextResponse.json(
      { message: "Polyline deleted successfully" },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({
      error: "Failed to delete polyline",
      details: error.message,
    });
  }
}
