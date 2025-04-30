import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { options } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { LineRepositoryImpl } from "@/src/infrastructure/repositories/lineDomainRepo";
import { GetLineUseCase } from "@/src/application/use-cases/lines/GetLineUseCase";
export async function GET(req: Request) {

    
    const session = await getServerSession(options);
  

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as { userId: number }
   


    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lineRepository = new LineRepositoryImpl();
    const getLineUsecase = new GetLineUseCase(lineRepository);
    const result = await getLineUsecase.execute(userId);
    return result;
  
} 