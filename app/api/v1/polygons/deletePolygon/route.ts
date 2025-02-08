// pages/api/v1/polygons/deletePolygon.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Delete all polygons associated with the user
    await prisma.polygon.deleteMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json(
      { message: "All polygons deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting polygons:", error);
    return NextResponse.json(
      { error: "Failed to delete polygons" },
      { status: 500 }
    );
  }
}
