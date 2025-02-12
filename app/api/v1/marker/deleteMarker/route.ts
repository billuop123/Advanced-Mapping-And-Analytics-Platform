// pages/api/v1/shapes/deleteMarker.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    const { email, coordinates } = await req.json();
    console.log(email, coordinates);
    if (!email || !coordinates) {
      return NextResponse.json(
        { error: "Email and coordinates are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(
      user.id,
      coordinates.lat.toFixed(14),
      coordinates.lng.toFixed(14)
    );
    const location = await prisma.location.findFirst({
      where: {
        userId: user.id,
        latitude: parseFloat(coordinates.lat.toFixed(15)),
        longitude: parseFloat(coordinates.lng.toFixed(15)),
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    await prisma.location.delete({
      where: { id: location.id },
    });

    return NextResponse.json(
      { message: "Marker deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting marker:", error);
    return NextResponse.json(
      { error: "Failed to delete marker" },
      { status: 500 }
    );
  }
}
