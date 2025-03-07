import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log(email);
  try {
    const role = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        role: true,
      },
    });

    if (!role) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role });
  } catch (err) {
    console.error("Error fetching role:", err);
    return NextResponse.json(
      { message: "Unable to fetch role" },
      { status: 500 }
    );
  }
}
