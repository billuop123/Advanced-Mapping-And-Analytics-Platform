import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = jwt.decode(session.user.accessToken) as { userId: number; role: string };
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user is admin, fetch all polylines
    if (role === "admin") {
      const polylines = await prisma.polyline.findMany({
        include: { shape: true },
      });
      return NextResponse.json(polylines, { status: 200 });
    }


    const polylines = await prisma.polyline.findMany({
      include: { shape: true },
    });

    return NextResponse.json(polylines, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching polylines:", error);
    return NextResponse.json(
      { error: `Failed to fetch polylines ${error.message}` },
      { status: 500 }
    );
  }
}
