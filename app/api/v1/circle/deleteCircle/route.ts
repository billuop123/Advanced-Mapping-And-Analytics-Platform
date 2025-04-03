  
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
export async function DELETE(req: Request) {
  try {
     const session= await getServerSession(options)
      console.log(session)
    const { email } = await req.json();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // const user = await prisma.user.findFirst({
    //   where: { email: email },
    // });

    if (!userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    await prisma.circle.deleteMany({
      where: {
        shape: {
          userId:Number(userId)
        },
      },
    });

    return NextResponse.json(
      { message: "All circles deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting circles:", error);
    return NextResponse.json(
      { error: "Failed to delete circles" },
      { status: 500 }
    );
  }
}
