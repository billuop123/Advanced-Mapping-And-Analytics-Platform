import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function POST(req: Request) {
  try {
    const { bounds, type } = await req.json();
const session = await getServerSession(options);
                                    
                                  
                                      if (!session) {
                                        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                      }
                              
                                      const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (  !bounds || !type) {
      return NextResponse.json(
        { error: "Email, bounds, and type are required" },
        { status: 400 }
      );
    }

    const roundedBounds = {
      southwest: {
        lat: parseFloat(bounds.southwest.lat.toFixed(15)),
        lng: parseFloat(bounds.southwest.lng.toFixed(15)),
      },
      northeast: {
        lat: parseFloat(bounds.northeast.lat.toFixed(15)),
        lng: parseFloat(bounds.northeast.lng.toFixed(15)),
      },
    };



    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: userId,
        rectangle: {
          create: {
            bounds: roundedBounds,
          },
        },
      },
      include: {
        rectangle: true,
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving rectangle:", error);
    return NextResponse.json(
      { error: "Failed to save rectangle" },
      { status: 500 }
    );
  }
}
