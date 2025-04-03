import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient"; // Adjust the import based on your project structure
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shape } = body;
        const session = await getServerSession(options);
                                                 
                                               
                                                   if (!session) {
                                                     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                                   }
a                                                   const {userId} = jwt.decode(session.user.accessToken) as {userId:number}


    if (!shape) {
      return NextResponse.json(
        { error: "Email and shape data are required" },
        { status: 400 }
      );
    }



    if (!userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    let center;
    if (shape.type === "CIRCLE") {
      center = {
        //@ts-expect-error
        lat: parseFloat(shape.data.center.lat.toFixed(15)),
        lng: parseFloat(shape.data.center.lng.toFixed(15)),
      };
    }

    let shapeToDelete;

    switch (shape.type) {
      case "CIRCLE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: userId,
            type: "CIRCLE",
            circle: {
              center: center, // Use the rounded center
              radius: parseFloat(shape.data.radius.toFixed(15)), // Ensure radius is also rounded
            },
          },
        });
        break;
      case "RECTANGLE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: userId,
            type: "RECTANGLE",
            rectangle: {
              bounds: shape.data.bounds, // Assuming bounds is a JSON object
            },
          },
        });
        break;
      case "POLYGON":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId:userId,
            type: "POLYGON",
            polygon: {
              coords: shape.data.coords, // Assuming coords is a JSON object
            },
          },
        });
        break;
      case "POLYLINE":
        shapeToDelete = await prisma.shape.findFirst({
          where: {
            userId: userId,
            type: "POLYLINE",
            polyline: {
              coords: shape.data.coords, // Assuming coords is a JSON object
            },
          },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid shape type" },
          { status: 400 }
        );
    }

    if (!shapeToDelete) {
      return NextResponse.json({ error: "Shape not found" }, { status: 404 });
    }

    // Delete the shape and its associated data
    await prisma.shape.delete({
      where: {
        id: shapeToDelete.id,
      },
    });

    return NextResponse.json(
      { message: "Shape deleted successfully" },
      { status: 200 }
    );
  } catch (error:any) {
    console.error("Error deleting shape:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete shape" },
      { status: 500 }
    );
  }
}
