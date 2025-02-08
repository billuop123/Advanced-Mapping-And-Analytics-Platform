import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

// Function to round coordinates to 10 decimal places
const roundTo10DecimalPlaces = (num) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Extract email and coordinates from the request body
    const { email, coords } = body;
    if (!email || !coords) {
      return NextResponse.json(
        { error: "Email and coordinates are required" },
        { status: 400 }
      );
    }

    // Round the coordinates to 10 decimal places
    const roundedCoords = coords.map((polygon) =>
      polygon.map((point) => ({
        lat: roundTo10DecimalPlaces(point.lat),
        lng: roundTo10DecimalPlaces(point.lng),
      }))
    );

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all polygons for the user
    const polygons = await prisma.polygon.findMany({
      where: {
        shape: {
          userId: user.id, // Ensure the polygon belongs to the user
        },
      },
    });

    // Find the polygon with matching coordinates (up to 10 decimal places)
    const polygon = polygons.find((polygon) => {
      const dbCoords = polygon.coords.map((polygon) =>
        polygon.map((point) => ({
          lat: roundTo10DecimalPlaces(point.lat),
          lng: roundTo10DecimalPlaces(point.lng),
        }))
      );
      return JSON.stringify(dbCoords) === JSON.stringify(roundedCoords);
    });

    if (!polygon) {
      return NextResponse.json({ error: "Polygon not found" }, { status: 404 });
    }

    // Delete the polygon
    await prisma.polygon.delete({
      where: {
        id: polygon.id,
      },
    });

    return NextResponse.json(
      { message: "Polygon deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting polygon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete polygon" },
      { status: 500 }
    );
  }
}
