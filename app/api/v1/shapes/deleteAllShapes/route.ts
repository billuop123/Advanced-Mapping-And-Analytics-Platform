import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { ShapeRepositoryImpl } from "@/src/infrastructure/repositories/shapeinfraRepo";
import { DeleteAllShapeUseCase } from "@/src/application/use-cases/shapes/DeleteAllShapeUseCase";

export async function DELETE(req: Request) {

   
  const session = await getServerSession(options);
                                           
                                         
                                             if (!session) {
                                               return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                             }
                           
                                             const {userId} = jwt.decode(session.user.accessToken) as {userId:number}

    


 

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const shapeRepository = new ShapeRepositoryImpl();
    const createShapeRepository = new DeleteAllShapeUseCase(shapeRepository);
    const result = await createShapeRepository.execute(userId);
    return result;
  } 

