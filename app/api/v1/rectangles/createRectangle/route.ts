import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    const { email, bounds, type } = await req.json();
    console.log(email, bounds, type);

    // Validate input
    if (!email || !bounds || !type) {
      return NextResponse.json(
        { error: "Email, bounds, and type are required" },
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

    console.log("--------------");
    console.log(user.id);

    // Check if the rectangle already exists for the user

    // Create a new shape with a rectangle
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: user.id, // Use the found user's ID
        rectangle: {
          create: {
            bounds: bounds,
          },
        },
      },
      include: {
        rectangle: true, // Include the rectangle in the response
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving rectangle:", error);
    return NextResponse.json(
      { error: "Failed to save rectangle" },
      { status: 500 }
    );
  }
}
