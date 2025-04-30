import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { RectangleRepositoryImpl } from "@/src/infrastructure/repositories/rectangleInfraRepo";
import { CreateRectangleUseCase } from "@/src/application/use-cases/rectangles/CreateRectanglesUseCase";
export async function POST(req: Request) {
  
    const { bounds, type } = await req.json();
const session = await getServerSession(options);
                                    
                                  
   if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
                              
  const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (  !bounds || !type) {
      return NextResponse.json(
        { error: "Email, bounds, and type are required" },
        { status: 400 }
      );
    }

    const polygonRepository = new RectangleRepositoryImpl();
    const createPolygonUseCase = new CreateRectangleUseCase(polygonRepository);
    const result = await createPolygonUseCase.execute(userId, bounds);
    return result;
  } 

