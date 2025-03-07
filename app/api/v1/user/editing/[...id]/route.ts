import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // Expecting a single id as a string
) {
  try {
    console.log("API called with ID:", params.id);

    // Convert the id to a number
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "Invalid ID format.",
        },
        { status: 400 }
      ); // Return a 400 Bad Request if the ID is invalid
    }

    const polygonInfo = await prisma.shape.findMany({
      where: {
        userId: id, // Use the parsed number directly
      },
      select: {
        type: true,
        user: true,
        rectangle: true,
        polygon: true,
        circle: true,
        polyline: true,
        date: true,
        id: true,
      },
    });

    return NextResponse.json({
      polygonInfo,
    });
  } catch (err: any) {
    console.error("Error fetching polygon info:", err); // Log the error for debugging
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    ); // Return a 500 Internal Server Error for unexpected errors
  }
}
