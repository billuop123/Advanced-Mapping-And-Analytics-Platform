import { prisma } from "@/app/services/prismaClient";
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
    await prisma.shape.delete({
      where: {
        id: shapeId,
      },
    });

    return NextResponse.json(
      { message: "Shape successfully deleted" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting shape:", err);
    return NextResponse.json(
      { message: "Error occurred", error: err.message },
      { status: 500 }
    );
  }
}
