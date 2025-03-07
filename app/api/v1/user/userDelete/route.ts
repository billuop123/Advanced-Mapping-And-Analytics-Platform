import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    console.log(id);
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({
      message: "user successfully deleted",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `could not delete the user:${err}`,
      },
      {
        status: 400,
      }
    );
  }
}
