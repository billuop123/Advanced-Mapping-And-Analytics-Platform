import { prisma } from "@/app/services/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }

    const markers = await prisma.location.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ markers }, { status: 200 });
  } catch (err) {
    console.error("Error fetching markers:", err);
    return NextResponse.json(
      { message: "An error occurred while fetching markers" },
      { status: 500 }
    );
  }
}
