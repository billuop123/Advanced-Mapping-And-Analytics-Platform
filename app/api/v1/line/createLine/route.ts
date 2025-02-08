import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Extract the email and coordinates from the request body
    const { email, coords, type } = await req.json();

    if (!email || !coords || !type) {
      return NextResponse.json(
        { error: "Email, coordinates, and type are required" },
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

    // Check if the polyline already exists for the user

    // Create a new shape with a polyline
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: user.id,
        polyline: {
          create: {
            coords: coords, // Store the coordinates as JSON
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
