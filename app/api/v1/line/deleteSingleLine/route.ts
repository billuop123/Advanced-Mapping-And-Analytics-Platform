import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

const roundTo10DecimalPlaces = (num) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
    const { email, coords } = await req.json();
    console.log(email, coords);
    console.log("--------------");
    // Validate input
    if (!email || !coords) {
      return NextResponse.json(
        { error: "Email and coordinates are required" },
        { status: 400 }
      );
    }

    const roundedCoords = coords.map((coord) => ({
      lat: roundTo10DecimalPlaces(coord.lat),
      lng: roundTo10DecimalPlaces(coord.lng),
    }));

    console.log("Rounded Coordinates:", roundedCoords);

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
    });

    const polyline = polylines.find((line) => {
      const dbCoords = line.coords.map((coord) => ({
        lat: roundTo10DecimalPlaces(coord.lat),
        lng: roundTo10DecimalPlaces(coord.lng),
      }));
      return JSON.stringify(dbCoords) === JSON.stringify(roundedCoords);
    });

    if (!polyline) {
      return NextResponse.json(
        { error: "Polyline with the specified coordinates not found" },
        { status: 404 }
      );
    }

    await prisma.polyline.delete({
      where: {
        id: polyline.id,
      },
    });

    return NextResponse.json(
      { message: "Polyline deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting polyline:", error);
    return NextResponse.json(
      { error: "Failed to delete polyline", details: error.message },
      { status: 500 }
    );
  }
}
