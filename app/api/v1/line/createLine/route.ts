import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";

import jwt from "jsonwebtoken"
import { LineRepositoryImpl } from "@/src/infrastructure/repositories/lineDomainRepo";
import { CreateLineUseCase } from "@/src/application/use-cases/lines/CreateLineUseCase";


export async function POST(req: Request) {
  const session = await getServerSession(options);
      
        if (!session) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    const {  coords, type } = await req.json();

    if (!coords || !type) {
      return NextResponse.json(
        { error: "coordinates, and type are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lineRepository = new LineRepositoryImpl();
    const createLineUsecase = new CreateLineUseCase(lineRepository);
    const result = await createLineUsecase.execute(userId, coords);
    return result;
 
}
