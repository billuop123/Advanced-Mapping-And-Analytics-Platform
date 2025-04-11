import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import jwt from "jsonwebtoken"
import { options } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export async function GET(req: Request) {
  try {
    
    const session = await getServerSession(options);
  

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }
   

    // Find the user by email

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all admins
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch polylines for the user and admins
    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: { in: [...adminIds, userId] }, // Get both user & admin shapes
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