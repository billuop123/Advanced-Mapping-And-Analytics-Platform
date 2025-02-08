import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Extract email and shapes array from request body
    const { email, shapes } = await req.json();

    if (!email || !shapes || !Array.isArray(shapes) || shapes.length === 0) {
      return NextResponse.json(
        { error: "Email and shapes array are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
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
        userId: user.id,
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
  } catch (error) {
    console.error("Error in batchCreate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to batch create shapes" },
      { status: 500 }
    );
  }
}
