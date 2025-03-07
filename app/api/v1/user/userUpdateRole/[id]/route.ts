import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });
    return NextResponse.json({
      messgae: "success",
      updatedUser,
    });
  } catch (err) {
    return NextResponse.json({
      message: "failed to update",
    });
  }
}
