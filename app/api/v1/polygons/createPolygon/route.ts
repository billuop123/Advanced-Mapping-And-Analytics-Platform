import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { PolygonRepositoryImpl } from "@/src/infrastructure/repositories/polygonInfraRepo";
import { CreatePolygonUseCase } from "@/src/application/use-cases/polygons/CreatePolygonUseCase";

export async function POST(req: Request) {

    const session = await getServerSession(options);
                          
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
                        
    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    const { coords, type } = await req.json();

    if (!coords || !type) {
      return NextResponse.json(
        { error: "Email, coordinates, and type are required" },
        { status: 400 }
      );
    }

    const polygonRepository = new PolygonRepositoryImpl();
    const createPolygonUseCase = new CreatePolygonUseCase(polygonRepository);
    const result = await createPolygonUseCase.execute(userId, coords, type);
    return result;

}
