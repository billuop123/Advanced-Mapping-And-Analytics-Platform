import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { RectangleRepositoryImpl } from "@/src/infrastructure/repositories/rectangleInfraRepo";
import { GetRectangleUseCase } from "@/src/application/use-cases/rectangles/GetRectangleUseCase";
export async function GET(req: Request) {
  try {


    const session = await getServerSession(options);
  

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }


  
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const rectangleRepository = new RectangleRepositoryImpl();
    const getRectangleUseCase = new GetRectangleUseCase(rectangleRepository);
    const result = await getRectangleUseCase.execute(userId);
    return result;
  } catch (error) {
    console.error("Error fetching rectangles:", error);
    return NextResponse.json(
      { error: "Failed to fetch rectangles" },
      { status: 500 }
    );
  }
}