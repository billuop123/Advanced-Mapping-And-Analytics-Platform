import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { ShapeRepositoryImpl } from "@/src/infrastructure/repositories/shapeinfraRepo";
import { BatchCreateShapeUseCase } from "@/src/application/use-cases/shapes/BatchCreateShapeUseCase";
export async function POST(req: Request) {
    const { shapes } = await req.json();
   const session = await getServerSession(options);
                                          
                                        
                                            if (!session) {
                                              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                            }
                               
                                            const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (!shapes || !Array.isArray(shapes) || shapes.length === 0) {
      return NextResponse.json(
        { error: "Email and shapes array are required" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const polygonRepository = new ShapeRepositoryImpl();
    const createShapeUseCase = new BatchCreateShapeUseCase(polygonRepository);
    const result = await createShapeUseCase.execute(userId, shapes);
    return result;
  } 

