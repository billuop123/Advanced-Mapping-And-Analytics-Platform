import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
import { PolygonRepositoryImpl } from "@/src/infrastructure/repositories/polygonInfraRepo";
import { DeletePolygonUseCase } from "@/src/application/use-cases/polygons/DeletePolygonUseCase";



export async function POST(req: Request) {
  
    // Parse the request body
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Request body is required" });
    }

    const { coords } = body;
      const session = await getServerSession(options);
                                 
                               
                                   if (!session) {
                                     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                   }
                              
                                   const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (  !coords) {
      return NextResponse.json({ error: "Email and coordinates are required" });
    }

    const polygonRepository = new PolygonRepositoryImpl();
    const deletePolygonUseCase = new DeletePolygonUseCase(polygonRepository);
    const result = await deletePolygonUseCase.execute(userId, coords);
    return result;
 
}
