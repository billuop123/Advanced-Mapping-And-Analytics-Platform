import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function POST(req: Request) {
  try {
    // Extract email and shapes array from request body
    const { shapes } = await req.json();
   const session = await getServerSession(options);
                                          
                                        
                                            if (!session) {
                                              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                            }
                                        //@ts-expect-error
                                            const {userId} = jwt.decode(session.user.accessToken) 
    if (!shapes || !Array.isArray(shapes) || shapes.length === 0) {
      return NextResponse.json(
        { error: "Email and shapes array are required" },
        { status: 400 }
      );
    }

    // Find the user by email
 

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare data for batch creation
    const shapeData = shapes.map((shape) => {
      const { type, data } = shape;

      if (!type || !data) {
        throw new Error("Each shape must have a type and data");
      }

      const shapeEntry: any = {
        type,
        userId: userId,
      };

      // Assign shape-specific data
      if (type === "CIRCLE") {
        shapeEntry.circle = {
          create: { center: data.center, radius: data.radius },
        };
      } else if (type === "POLYGON") {
        shapeEntry.polygon = { create: { coords: data.coords } };
      } else if (type === "POLYLINE") {
        shapeEntry.polyline = { create: { coords: data.coords } };
      } else if (type === "RECTANGLE") {
        shapeEntry.rectangle = { create: { bounds: data.bounds } };
      } else {
        throw new Error(`Invalid shape type: ${type}`);
      }

      return shapeEntry;
    });

    // Insert all shapes in a batch transaction
    const createdShapes = await prisma.$transaction(
      shapeData.map((shape) =>
        prisma.shape.create({
          data: shape,
          include: {
            circle: true,
            polygon: true,
            polyline: true,
            rectangle: true,
          },
        })
      )
    );

    return NextResponse.json(createdShapes, { status: 201 });
  } catch (error:any) {
    console.error("Error in batchCreate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to batch create shapes" },
      { status: 500 }
    );
  }
}
