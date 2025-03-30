import { options } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
                          
                        
                            if (!session) {
                              return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                            }
                        //@ts-expect-error
                            const {userId} = jwt.decode(session.user.accessToken) 


 

    if (!userId) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    const adminIds = admins.map((admin) => admin.id);
    const markers = await prisma.location.findMany({
      where: {
        userId: { in: [...adminIds, userId] },
      },
    });

    return NextResponse.json({ markers }, { status: 200 });
  } catch (err) {
    console.error("Error fetching markers:", err);
    return NextResponse.json(
      { message: "An error occurred while fetching markers" },
      { status: 500 }
    );
  }
}
