import { prisma } from "@/app/services/prismaClient";
import { DeleteAllShapeUseCase } from "@/src/application/use-cases/shapes/DeleteAllShapeUseCase";
import { DeleteShapeByIdUseCase } from "@/src/application/use-cases/shapes/DeleteShapeByIdUseCase";
import { ShapeRepositoryImpl } from "@/src/infrastructure/repositories/shapeinfraRepo";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } // `id` is a string in the URL
) {
  const { id } = params;

  const shapeId = parseInt(id, 10);

  if (isNaN(shapeId)) {
    return NextResponse.json({ message: "Invalid shape ID" }, { status: 400 });
  }

  try {
    const shapeRepository = new ShapeRepositoryImpl();
    const createShapeRepository = new DeleteShapeByIdUseCase(shapeRepository);
    const result = await createShapeRepository.execute(shapeId);
    return result;
  } catch (err: any) {
    console.error("Error deleting shape:", err);
    return NextResponse.json(
      { message: "Error occurred", error: err.message },
      { status: 500 }
    );
  }
}
