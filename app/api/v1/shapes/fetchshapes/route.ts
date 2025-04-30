import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
   
    const allShapes = await prisma.shape.findMany({
      select: {
        id: true, 
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

    return NextResponse.json({ allShapes }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch shapes" },
      { status: 500 }
    );
  }
}
