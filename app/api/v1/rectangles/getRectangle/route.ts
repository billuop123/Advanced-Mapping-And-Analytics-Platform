import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Extract the email from the request body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all rectangles associated with the user
    const rectangles = await prisma.rectangle.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
      include: {
        shape: true, // Include the associated shape
      },
    });

    return NextResponse.json(rectangles, { status: 200 });
  } catch (error) {
    console.error("Error fetching rectangles:", error);
    return NextResponse.json(
      { error: "Failed to fetch rectangles" },
      { status: 500 }
    );
  }
}
