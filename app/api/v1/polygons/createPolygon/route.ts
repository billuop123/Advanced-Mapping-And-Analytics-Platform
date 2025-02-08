import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Extract the email, coordinates, and type from the request body
    const { email, coords, type } = await req.json();

    if (!email || !coords || !type) {
      return NextResponse.json(
        { error: "Email, coordinates, and type are required" },
        { status: 400 }
      );
    }

    // Round the coordinates to 15 decimal places
    const roundedCoords = coords.map((polygon) =>
      polygon.map((point) => ({
        lat: parseFloat(point.lat.toFixed(15)),
        lng: parseFloat(point.lng.toFixed(15)),
      }))
    );

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new shape with a polygon
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: user.id,
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
