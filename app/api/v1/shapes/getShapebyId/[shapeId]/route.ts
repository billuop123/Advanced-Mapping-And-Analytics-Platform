import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: { shapeId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shapeId } = params;
    
    console.log("Shape ID from params:", shapeId); // Debug log

    if (!shapeId) {
      return NextResponse.json({ error: "Shape ID is required" }, { status: 400 });
    }

    const shape = await prisma.shape.findUnique({
      where: {
        id: parseInt(shapeId)
      },
      include: {
        rectangle: true,
        polygon: true,
        circle: true,
        polyline: true,
        user: true
      }
    });

    if (!shape) {
      return NextResponse.json({ error: "Shape not found" }, { status: 404 });
    }

    return NextResponse.json(shape, { status: 200 });
  } catch (error) {
    console.error("Error fetching shape:", error);
    return NextResponse.json(
      { error: "Failed to fetch shape" },
      { status: 500 }
    );
  }
} 