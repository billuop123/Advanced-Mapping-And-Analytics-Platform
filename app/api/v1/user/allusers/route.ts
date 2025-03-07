import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { not: "admin" },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    return NextResponse.json({
      users,
    });
  } catch (e) {
    return NextResponse.json({
      messgae: "Failed to fetch Users",
    });
  }
}
