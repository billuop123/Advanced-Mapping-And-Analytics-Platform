import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminDetails = await prisma.user.findMany({
      where: {
        role: "admin",
      },
    });
    return NextResponse.json({
      adminDetails,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Error fetching details",
    });
  }
}
