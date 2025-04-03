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

        const decodedToken = jwt.decode(session.user.accessToken);
        if (!decodedToken || typeof decodedToken === 'string') {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const userId = Number(decodedToken.userId);
   
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all admins
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch admin circles (✅ Fixed)
    const adminCircles = await prisma.circle.findMany({
      where: {
        shape: {
          userId: { in: adminIds }, // ✅ Correct filtering
        },
      },
      include: { shape: true },
    });

    // Fetch user circles
    const userCircles = await prisma.circle.findMany({
      where: {
        shape: {
          userId: userId,
        },
      },
      include: { shape: true },
    });

    // Merge and remove duplicates
    const allCircles = [...userCircles, ...adminCircles];
    const uniqueCircles = Array.from(
      new Map(allCircles.map((c) => [c.id, c])).values()
    );

    // Format response
    const formattedCircles = uniqueCircles.map((circle) => ({
      center: circle.center,
      radius: circle.radius,
    }));

    return NextResponse.json(formattedCircles, { status: 200 });
  } catch (error:any) {
    console.error("Error fetching circles:", error);
    return NextResponse.json(
      { error: `Failed to fetch circles ${error.message}` },
      { status: 500 }
    );
  }
}
