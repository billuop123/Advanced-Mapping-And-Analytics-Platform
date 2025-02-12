import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

// Function to round coordinates to 10 decimal places
const roundTo10DecimalPlaces = (num) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
    const { email, bounds } = await req.json();

    // Validate input
    if (!email || !bounds) {
      return NextResponse.json(
        { error: "Email and bounds are required" },
        { status: 400 }
      );
    }

    const roundedBounds = {
      southwest: {
        lat: roundTo10DecimalPlaces(bounds._southWest.lat),
        lng: roundTo10DecimalPlaces(bounds._southWest.lng),
      },
      northeast: {
        lat: roundTo10DecimalPlaces(bounds._northEast.lat),
        lng: roundTo10DecimalPlaces(bounds._northEast.lng),
      },
    };

    console.log("Rounded Bounds:", roundedBounds);

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all rectangles for the user
    const rectangles = await prisma.rectangle.findMany({
      where: {
        shape: {
          userId: user.id, // Ensure the rectangle belongs to the user
        },
      },
    });

    // Find the rectangle with matching bounds (up to 10 decimal places)
    const rectangle = rectangles.find((rect) => {
      const dbBounds = {
        southwest: {
          lat: roundTo10DecimalPlaces(rect.bounds.southwest.lat),
          lng: roundTo10DecimalPlaces(rect.bounds.southwest.lng),
        },
        northeast: {
          lat: roundTo10DecimalPlaces(rect.bounds.northeast.lat),
          lng: roundTo10DecimalPlaces(rect.bounds.northeast.lng),
        },
      };
      return JSON.stringify(dbBounds) === JSON.stringify(roundedBounds);
    });

    if (!rectangle) {
      return NextResponse.json(
        { error: "Rectangle with the specified bounds not found" },
        { status: 404 }
      );
    }

    // Delete the specific rectangle
    await prisma.rectangle.delete({
      where: {
        id: rectangle.id, // Use the unique ID of the rectangle
      },
    });

    return NextResponse.json(
      { message: "Rectangle deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting rectangle:", error);
    return NextResponse.json(
      { error: "Failed to delete rectangle", details: error.message },
      { status: 500 }
    );
  }
}
