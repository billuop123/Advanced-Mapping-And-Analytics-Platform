import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient"; // Adjust the import based on your project structure

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { email, shape } = body;

    console.log(email, shape);

    if (!email || !shape) {
      return NextResponse.json(
        { error: "Email and shape data are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Prepare the center coordinates with toFixed(15)
    let center;
    if (shape.type === "CIRCLE") {
      center = {
        lat: parseFloat(shape.data.center.lat.toFixed(15)),
        lng: parseFloat(shape.data.center.lng.toFixed(15)),
      };
    }

    // Find the shape to delete based on type and data
    let shapeToDelete;

    switch (shape.type) {
      case "CIRCLE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: user.id,
            type: "CIRCLE",
            circle: {
              center: center, // Use the rounded center
              radius: parseFloat(shape.data.radius.toFixed(15)), // Ensure radius is also rounded
            },
          },
        });
        break;
      case "RECTANGLE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: user.id,
            type: "RECTANGLE",
            rectangle: {
              bounds: shape.data.bounds, // Assuming bounds is a JSON object
            },
          },
        });
        break;
      case "POLYGON":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: user.id,
            type: "POLYGON",
            polygon: {
              coords: shape.data.coords, // Assuming coords is a JSON object
            },
          },
        });
        break;
      case "POLYLINE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: user.id,
            type: "POLYLINE",
            polyline: {
              coords: shape.data.coords, // Assuming coords is a JSON object
            },
          },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid shape type" },
          { status: 400 }
        );
    }

    if (!shapeToDelete) {
      return NextResponse.json({ error: "Shape not found" }, { status: 404 });
    }

    // Delete the shape and its associated data
    await prisma.shape.delete({
      where: {
        id: shapeToDelete.id,
      },
    });

    return NextResponse.json(
      { message: "Shape deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting shape:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete shape" },
      { status: 500 }
    );
  }
}
