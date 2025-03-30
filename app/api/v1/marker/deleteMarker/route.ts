// pages/api/v1/shapes/deleteMarker.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function POST(req: Request) {
  try {
       const session = await getServerSession(options);
                      
                    
                        if (!session) {
                          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                        }
                    //@ts-expect-error
                        const {userId} = jwt.decode(session.user.accessToken) 
    const { coordinates } = await req.json();

    if (!coordinates) {
      return NextResponse.json(
        { error: "Email and coordinates are required" },
        { status: 400 }
      );
    }



    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const location = await prisma.location.findFirst({
      where: {
        userId: userId,
        latitude: parseFloat(coordinates.lat.toFixed(15)),
        longitude: parseFloat(coordinates.lng.toFixed(15)),
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" });
    }

    await prisma.location.delete({
      where: { id: location.id },
    });

    return NextResponse.json(
      { message: "Marker deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    //@ts-expect-error
    return NextResponse.json({ error: error.message });
  }
}
