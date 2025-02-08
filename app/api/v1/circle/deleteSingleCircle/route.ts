import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Extract email, center, and radius from the request body
    const { email, center, radius } = body;
    if (!email || !center || !radius) {
      return NextResponse.json(
        { error: "Email, center, and radius are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Find the circle based on center, radius, and user ID
    const circle = await prisma.circle.findFirst({
      where: {
        radius: radius,
        center: {
          path: ["lat"], // Query the `lat` property of the `center` JSON
          equals: center.lat,
        },
        shape: {
          userId: user.id,
        },
      },
    });

    if (!circle) {
      console.error("Circle not found for:", {
        center,
        radius,
        userId: user.id,
      });
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // Delete the circle
    await prisma.circle.delete({
      where: {
        id: circle.id,
      },
    });

    return NextResponse.json(
      { message: "Circle deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting circle:", error || "Unknown error");
    return NextResponse.json(
      { error: error?.message || "Failed to delete circle" },
      { status: 500 }
    );
  }
}
