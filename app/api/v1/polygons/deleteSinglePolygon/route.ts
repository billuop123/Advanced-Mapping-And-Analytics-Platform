import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

// Function to round coordinates to 10 decimal places
const roundTo10DecimalPlaces = (num: number) => {
  return parseFloat(num.toFixed(10));
};

// Function to compare two sets of coordinates

const areCoordinatesEqual = (coords1: any[], coords2: any[]) => {
  if (coords1.length !== coords2.length) return false;

  for (let i = 0; i < coords1.length; i++) {
    const point1 = coords1[i];
    const point2 = coords2[i];

    if (
      roundTo10DecimalPlaces(point1.lat) !==
        roundTo10DecimalPlaces(point2.lat) ||
      roundTo10DecimalPlaces(point1.lng) !== roundTo10DecimalPlaces(point2.lng)
    ) {
      return false;
    }
  }

  return true;
};

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Request body is required" });
    }

    const { email, coords } = body;
    if (!email || !coords) {
      return NextResponse.json({ error: "Email and coordinates are required" });
    }

    // Normalize coords to ensure it's a flat array of objects
    const normalizedCoords = Array.isArray(coords) ? coords : [coords];

    // Round the coordinates to 10 decimal places
  
    const roundedCoords = normalizedCoords.map((point: any) => ({
      lat: roundTo10DecimalPlaces(point.lat),
      lng: roundTo10DecimalPlaces(point.lng),
    }));

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    // Find all polygons for the user
    const polygons = await prisma.polygon.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
    });

    // Find the polygon with matching coordinates (up to 10 decimal places)
    const polygon = polygons.find((polygon) => {
      // Ensure polygon.coords is a flat array of objects
      let dbCoords = polygon.coords;

      // If polygon.coords is a nested array, flatten it
      if (
        Array.isArray(dbCoords) &&
        dbCoords.length > 0 &&
        Array.isArray(dbCoords[0])
      ) {
        dbCoords = dbCoords.flat();
      }

      // Round the database coordinates
      //@ts-expect-error
      const roundedDbCoords = dbCoords?.map((point: any) => ({
        lat: roundTo10DecimalPlaces(point.lat),
        lng: roundTo10DecimalPlaces(point.lng),
      }));

      // Compare the coordinates
      return areCoordinatesEqual(roundedDbCoords, roundedCoords);
    });

    if (!polygon) {
      return NextResponse.json({ error: "Polygon not found" });
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
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Failed to delete polygon",
    });
  }
}
