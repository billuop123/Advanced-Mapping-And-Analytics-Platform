import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    // Parse the request body
  const session = await getServerSession(options);
                                           
                                         
                                             if (!session) {
                                               return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
                                             }
                                         //@ts-expect-error
                                             const {userId} = jwt.decode(session.user.accessToken) 

    

    // Find the user by email
 

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all shapes associated with the user
    await prisma.shape.deleteMany({
      where: { userId: userId },
    });

    return NextResponse.json(
      { message: "All shapes deleted successfully" },
      { status: 200 }
    );
  } catch (error:any) {
    console.error("Error in deleteAllShapes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete shapes" },
      { status: 500 }
    );
  }
}
