  
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function DELETE(req: Request) {
  try {
  
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    await prisma.circle.deleteMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json(
      { message: "All circles deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting circles:", error);
    return NextResponse.json(
      { error: "Failed to delete circles" },
      { status: 500 }
    );
  }
}
