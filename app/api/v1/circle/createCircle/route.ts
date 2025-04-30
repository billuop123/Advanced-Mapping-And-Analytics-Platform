import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route"; // Ensure this is the correct import for your auth options
import jwt from "jsonwebtoken";
import { CircleRepositoryImpl } from "@/src/infrastructure/repositories/circleInfraRepo";
import { CreateCircleUseCase } from "@/src/application/use-cases/circles/CreateCircleUseCase";

export async function POST(req: Request) {
  
  
    const {  center, radius, type } = await req.json();


    const session = await getServerSession(options);
  

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }

    if (!userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

 
    if ( !center || !radius || !type) {
      return NextResponse.json(
        { error: "Email, center, radius, and type are required" },
        { status: 400 }
      );
    }
    const circleRepository = new CircleRepositoryImpl();
    const createCircleUseCase = new CreateCircleUseCase(circleRepository);
    const result = await createCircleUseCase.execute(userId, center, radius, type);
    return result;
}