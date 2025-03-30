import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
// Function to round coordinates to 10 decimal places
const roundTo10DecimalPlaces = (num:Number) => {
  return parseFloat(num.toFixed(10));
};

export async function POST(req: Request) {
  try {
    const { bounds } = await req.json();
    const session = await getServerSession(options);
                                        
                                      
                                          if (!session) {
                                            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                          }
                                      //@ts-expect-error
                                          const {userId} = jwt.decode(session.user.accessToken) 
    // Validate input
    if (!bounds) {
      return NextResponse.json(
        { error: "Email and bounds are required" },
        { status: 400 }
      );
    }

    const roundedBounds = {
      southwest: {
        lat: roundTo10DecimalPlaces(bounds._southWest.lat),
        lng: roundTo10DecimalPlaces(bounds._southWest.lng),
      },
      northeast: {
        lat: roundTo10DecimalPlaces(bounds._northEast.lat),
        lng: roundTo10DecimalPlaces(bounds._northEast.lng),
      },
    };

    console.log("Rounded Bounds:", roundedBounds);



    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all rectangles for the user
    const rectangles = await prisma.rectangle.findMany({
      where: {
        shape: {
          userId: userId, // Ensure the rectangle belongs to the user
        },
      },
    });

    // Find the rectangle with matching bounds (up to 10 decimal places)
    const rectangle = rectangles.find((rect) => {
      const dbBounds = {
        southwest: {
          //@ts-expect-error
          lat: roundTo10DecimalPlaces(rect.bounds!.southwest.lat),
             //@ts-expect-error
          lng: roundTo10DecimalPlaces(rect.bounds.southwest.lng),
        },
        northeast: {
             //@ts-expect-error
          lat: roundTo10DecimalPlaces(rect.bounds.northeast.lat),
             //@ts-expect-error
          lng: roundTo10DecimalPlaces(rect.bounds.northeast.lng),
        },
      };
      return JSON.stringify(dbBounds) === JSON.stringify(roundedBounds);
    });

    if (!rectangle) {
      return NextResponse.json({
        error: "Rectangle with the specified bounds not found",
      });
    }

    // Delete the specific rectangle
    await prisma.rectangle.delete({
      where: {
        id: rectangle.id, // Use the unique ID of the rectangle
      },
    });

    return NextResponse.json(
      { message: "Rectangle deleted successfully" },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({
      details: error.message,
    });
  }
}
