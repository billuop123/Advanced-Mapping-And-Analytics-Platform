import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
  try {
      const session= await getServerSession(options)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
//@ts-expect-error
     const {userId} = jwt.decode(session.user.accessToken) 
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }


    const {  center, radius } = body;
    if (!center || !radius) {
      return NextResponse.json(
        { error: "Email, center, and radius are required" },
        { status: 400 }
      );
    }

   
    if (!userId) {
      return NextResponse.json({ error: "User  not found" });
    }

    // Find the circle based on center, radius, and user ID
    const circle = await prisma.circle.findFirst({
      where: {
        radius: radius,
        center: {
          path: ["lat"], // Query the `lat` property of the `center` JSON
          equals: center.lat,
        },
        shape: {
          userId: Number(userId),
        },
      },
    });

    if (!circle) {
      console.error("Circle not found for:", {
        center,
        radius,
        userId: userId,
      });
      return NextResponse.json({ error: "Circle not found" });
    }

    // Delete the circle
    await prisma.circle.delete({
      where: {
        id: circle.id,
      },
    });

    return NextResponse.json(
      { message: "Circle deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting circle:", error || "Unknown error");
    return NextResponse.json(
//@ts-expect-error
      { error: error?.message || "Failed to delete circle" },
      { status: 500 }
    );
  }
}
