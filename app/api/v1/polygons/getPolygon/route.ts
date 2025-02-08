import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function POST(req: Request) {
  try {
    // Extract the email from the request body
    const { email } = await req.json();
    console.log(email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Fetch all polygons associated with the user
    const polygons = await prisma.polygon.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
      include: {
        shape: true, // Include the associated shape data
      },
    });

    // Map the polygons to return only the coordinates
    const formattedPolygons = polygons.map((polygon) => ({
      coords: polygon.coords, // Assuming coords is already in the correct format
    }));

    return NextResponse.json(formattedPolygons, { status: 200 });
  } catch (error) {
    console.error("Error fetching polygons:", error);
    return NextResponse.json(
      { error: "Failed to fetch polygons" },
      { status: 500 }
    );
  }
}
