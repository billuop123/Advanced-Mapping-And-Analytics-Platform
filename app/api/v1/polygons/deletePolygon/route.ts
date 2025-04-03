// pages/api/v1/polygons/deletePolygon.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function DELETE(req: Request) {
  try {
       const session = await getServerSession(options);
                             
                           
                               if (!session) {
                                 return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                               }
                      
                               const {userId} = jwt.decode(session.user.accessToken) as {userId:number}


 
    if (!userId) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Delete all polygons associated with the user
    await prisma.polygon.deleteMany({
      where: {
        shape: {
          userId: userId,
        },
      },
    });

    return NextResponse.json(
      { message: "All polygons deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting polygons:", error);
    return NextResponse.json(
      { error: "Failed to delete polygons" },
      { status: 500 }
    );
  }
}
