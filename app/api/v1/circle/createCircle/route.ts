import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    // Extract the email, center, radius, and type from the request body
    const { email, center, radius, type } = await req.json();
    const session = await getServerSession({ req })
    console.log(session)
    if(!session){
      return res.json({
        Message:"unauthorized"
      })
    }
    if (!email || !center || !radius || !type) {
      return NextResponse.json(
        { error: "Email, center, radius, and type are required" },
        { status: 400 }
      );
    }

    // Round the center coordinates and radius to 15 decimal places
    const roundedCenter = {
      lat: parseFloat(center.lat.toFixed(15)),
      lng: parseFloat(center.lng.toFixed(15)),
    };
    const roundedRadius = parseFloat(radius.toFixed(15));

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new shape with a circle
    const shape = await prisma.shape.create({
      data: {
        type: type,
        userId: user.id,
        circle: {
          create: {
            center: roundedCenter,
            radius: roundedRadius,
          },
        },
      },
      include: {
        circle: true, // Include the circle in the response
      },
    });

    return NextResponse.json(shape, { status: 201 });
  } catch (error) {
    console.error("Error saving circle:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save circle" },
      { status: 500 }
    );
  }
}
