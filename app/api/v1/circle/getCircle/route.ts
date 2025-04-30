import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { CircleRepositoryImpl } from "@/src/infrastructure/repositories/circleInfraRepo";
import { GetCircleUseCase } from "@/src/application/use-cases/circles/GetCircleUseCase";
export async function GET(req: Request) {

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
    const circleRepository = new CircleRepositoryImpl();
    const deleteCircleUseCase = new GetCircleUseCase(circleRepository);
    const result = await deleteCircleUseCase.execute(userId);
    return result;
  } 

