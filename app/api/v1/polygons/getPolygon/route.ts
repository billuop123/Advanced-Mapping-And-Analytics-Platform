import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all admins
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch polygons for user and admins
    const polygons = await prisma.polygon.findMany({
      where: {
        shape: {
          userId: { in: [...adminIds, user.id] },
        },
      },
      include: { shape: true },
    });

    // Format response
    const formattedPolygons = polygons.map((polygon) => ({
      coords: polygon.coords,
    }));

    return NextResponse.json(formattedPolygons, { status: 200 });
  } catch (error) {
    console.error("Error fetching polygons:", error);
    return NextResponse.json(
      { error: "Failed to fetch polygons" },
      { status: 500 }
    );
  }
}
