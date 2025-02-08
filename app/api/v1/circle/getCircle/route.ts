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

    // Fetch all circles associated with the user
    const circles = await prisma.circle.findMany({
      where: {
        shape: {
          userId: user.id,
        },
      },
      include: {
        shape: true, // Include the associated shape data
      },
    });

    // Map the circles to the expected format
    const formattedCircles = circles.map((circle) => ({
      center: circle.center, // Assuming center is already in the correct format
      radius: circle.radius,
    }));

    return NextResponse.json(formattedCircles, { status: 200 });
  } catch (error) {
    console.error("Error fetching circles:", error);
    return NextResponse.json(
      { error: "Failed to fetch circles" },
      { status: 500 }
    );
  }
}
