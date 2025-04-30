import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { PolygonRepositoryImpl } from "@/src/infrastructure/repositories/polygonInfraRepo";
import {GetPolygonUseCase } from "@/src/application/use-cases/polygons/GetPolygonUseCase";

export async function GET(req: Request) {

    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const polygonRepository = new PolygonRepositoryImpl();
    const getPolygonUseCase = new GetPolygonUseCase(polygonRepository);
    const result = await getPolygonUseCase.execute(userId);
    return result;
  
}
