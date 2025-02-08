import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function DELETE(req: Request) {
  try {
    // Parse the request body
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

    // Delete all shapes associated with the user
    await prisma.shape.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { message: "All shapes deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleteAllShapes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete shapes" },
      { status: 500 }
    );
  }
}
