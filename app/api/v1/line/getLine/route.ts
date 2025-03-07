import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all admins
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch polylines for the user and admins
    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: { in: [...adminIds, user.id] }, // Get both user & admin shapes
        },
      },
      include: { shape: true },
    });

    // Format response
    const formattedPolylines = polylines.map((polyline) => ({
      coords: polyline.coords,
    }));

    return NextResponse.json(formattedPolylines, { status: 200 });
  } catch (error) {
    console.error("Error fetching polylines:", error);
    return NextResponse.json({ error: "Failed to fetch polylines" });
  }
}
