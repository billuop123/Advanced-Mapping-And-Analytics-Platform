import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken"
export async function POST(req: Request) {
  try {

         const session = await getServerSession(options);
                                    
                                  
                                      if (!session) {
                                        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                      }
                                  //@ts-expect-error
                                      const {userId} = jwt.decode(session.user.accessToken) 

    

    // Find the user

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all admins
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);

    // Fetch polygons for user and admins
    const polygons = await prisma.polygon.findMany({
      where: {
        shape: {
          userId: { in: [...adminIds, userId] },
        },
      },
      include: { shape: true },
    });

    // Format response
    const formattedPolygons = polygons.map((polygon) => ({
      coords: polygon.coords,
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
