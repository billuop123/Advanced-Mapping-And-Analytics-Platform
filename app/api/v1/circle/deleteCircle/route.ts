  
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { CircleRepositoryImpl } from "@/src/infrastructure/repositories/circleInfraRepo";
import { CreateCircleUseCase } from "@/src/application/use-cases/circles/CreateCircleUseCase";
import { DeleteCircleUseCase } from "@/src/application/use-cases/circles/DeleteCircleUseCase";
export async function DELETE(req: Request) {
  try {
     const session= await getServerSession(options)
      console.log(session)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }
    

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
