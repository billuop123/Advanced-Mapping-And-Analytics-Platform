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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all polylines associated with the user
    const polylines = await prisma.polyline.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
      include: {
        shape: true, // Include the associated shape data
      },
    });

    // Map the polylines to the expected format
    const formattedPolylines = polylines.map((polyline) => ({
      coords: polyline.coords, // Assuming coords is already in the correct format
    }));

    return NextResponse.json(formattedPolylines, { status: 200 });
  } catch (error) {
    console.error("Error fetching polylines:", error);
    return NextResponse.json(
      { error: "Failed to fetch polylines" },
      { status: 500 }
    );
  }
}
