import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
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
          userId: user.id,
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
  } catch (error) {
    console.error("Error fetching circles:", error);
    return NextResponse.json(
      { error: "Failed to fetch circles" },
      { status: 500 }
    );
  }
}
