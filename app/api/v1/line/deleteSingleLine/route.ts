import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { LineRepositoryImpl } from "@/src/infrastructure/repositories/lineDomainRepo";
import { CreateLineUseCase } from "@/src/application/use-cases/lines/CreateLineUseCase";
import { DeleteLineUseCase } from "@/src/application/use-cases/lines/DeleteLineUseCase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(options);
          
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    const {coords} = await req.json();
   
    if (!coords) {
      return NextResponse.json(
        { error: "Coordinates are required" },
        { status: 400 }
      );
    }

    const lineRepository = new LineRepositoryImpl();
    const deleteLineUsecase = new DeleteLineUseCase(lineRepository);
    const result = await deleteLineUsecase.execute(userId, coords);
    
    if (result.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Error deleting line:", error);
    return NextResponse.json({
      error: "Failed to delete line",
      details: error.message,
    }, { status: 500 });
  }
} 

