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

    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const markers = await prisma.location.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({ markers }, { status: 200 });
  } catch (error:any) {
    console.error("Error fetching markers:", error);
    return NextResponse.json(
      { error: `Failed to fetch markers ${error.message}` },
      { status: 500 }
    );
  }
}
