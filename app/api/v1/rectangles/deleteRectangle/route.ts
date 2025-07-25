import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function DELETE(req: Request) {
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

    // Delete all rectangles associated with the user
    await prisma.rectangle.deleteMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json(
      { message: "All rectangles deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting rectangles:", error);
    return NextResponse.json(
      { error: "Failed to delete rectangles" },
      { status: 500 }
    );
  }
}
