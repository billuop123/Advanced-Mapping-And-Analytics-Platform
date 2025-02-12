import { prisma } from "@/app/services/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, newLocation } = await req.json();
    console.log(email, newLocation);
    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // If no user is found, return an error response
    if (!user) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }

    // Create a new location in the database
    const newMarker = await prisma.location.create({
      data: {
        userId: user.id,
        latitude: newLocation.latitude, // Access latitude directly
        longitude: newLocation.longitude, // Access longitude directly
        description: newLocation.description, // Use name or description
        type: newLocation.type,
      },
    });

    // Return the newly created location
    return NextResponse.json({ newMarker }, { status: 201 });
  } catch (err) {
    console.error("Error creating location:", err);
    return NextResponse.json(
      { message: "An error occurred while creating the location" },
      { status: 500 }
    );
  }
}
