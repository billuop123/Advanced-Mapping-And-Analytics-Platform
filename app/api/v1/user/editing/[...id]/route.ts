import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    console.log("API called with ID:", params.id);


    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "Invalid ID format.",
        },
        { status: 400 }
      );
    }

    const polygonInfo = await prisma.shape.findMany({
      where: {
        userId: id,
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
    console.error("Error fetching polygon info:", err); 
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    ); 
  }
}
