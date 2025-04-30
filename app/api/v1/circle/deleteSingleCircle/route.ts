import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { CircleRepositoryImpl } from "@/src/infrastructure/repositories/circleInfraRepo";
import { DeleteCircleUseCase } from "@/src/application/use-cases/circles/DeleteCircleUseCase";
export async function POST(req: Request) {

    const session= await getServerSession(options)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken)  as { userId: number }
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }


    const {  center, radius } = body;
    if (!center || !radius) {
      return NextResponse.json(
        { error: "Email, center, and radius are required" },
        { status: 400 }
      );
    }

   
    if (!userId) {
      return NextResponse.json({ error: "User  not found" });
    }
    const circleRepository = new CircleRepositoryImpl();
    const deleteCircleUseCase = new DeleteCircleUseCase(circleRepository);
    const result = await deleteCircleUseCase.execute(userId,center,radius);
    return result;
}
