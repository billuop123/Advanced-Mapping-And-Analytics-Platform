import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

// Function to round coordinates to 10 decimal places
const roundTo10DecimalPlaces = (num) => {
  return parseFloat(num.toFixed(10));
};

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

    // Round the coordinates to 10 decimal places
    const roundedCoords = coords.map((coord) => ({
      lat: roundTo10DecimalPlaces(coord.lat),
      lng: roundTo10DecimalPlaces(coord.lng),
    }));

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new shape with a polyline
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: user.id,
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
