import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch all shapes with their associated user names and shape details
    const allShapes = await prisma.shape.findMany({
      select: {
        id: true, // Include the shape ID for better identification
        user: {
          select: {
            name: true,
          },
        },
        rectangle: true,
        polygon: true,
        circle: true,
        polyline: true,
        type: true,
      },
    });

    // Return the fetched data as a JSON response with a 200 status code
    return NextResponse.json({ allShapes }, { status: 200 });
  } catch (err) {
    console.error("Error fetching shapes:", err);
    // Return an error response with a 500 status code
    return NextResponse.json(
      { error: "Failed to fetch shapes" },
      { status: 500 }
    );
  }
}
