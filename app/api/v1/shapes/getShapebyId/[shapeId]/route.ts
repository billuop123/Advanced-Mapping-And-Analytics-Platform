import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import { ShapeRepositoryImpl } from "@/src/infrastructure/repositories/shapeinfraRepo";
import { FindShapeByIdUseCase } from "@/src/application/use-cases/shapes/FindShapeByIdUseCase";

export async function GET(
  req: Request,
  { params }: { params: { shapeId: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shapeId } = params;
    

    if (!shapeId) {
      return NextResponse.json({ error: "Shape ID is required" }, { status: 400 });
    }

    const shapeRepository = new ShapeRepositoryImpl();
    const findShapeByIdUseCase = new FindShapeByIdUseCase  (shapeRepository);
    const result = await findShapeByIdUseCase.execute(Number(shapeId));
    return result;
  } catch (error) {
    console.error("Error fetching shape:", error);
    return NextResponse.json(
      { error: "Failed to fetch shape" },
      { status: 500 }
    );
  }
} 