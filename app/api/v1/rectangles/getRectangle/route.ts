// import { NextResponse } from "next/server";
// import { prisma } from "@/app/services/prismaClient";
// import { getServerSession } from "next-auth";
// import { options } from "@/app/api/auth/[...nextauth]/route";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(options);
//     if (!session) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const {userId} = jwt.decode(session.user.accessToken) as {userId:number}
//     if (!userId) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const rectangles = await prisma.rectangle.findMany({
//       where: {
//         shape: {
//           userId: userId,
//         },
//       },
//       include: { shape: true },
//     });

//     return NextResponse.json(rectangles, { status: 200 });
//   } catch (error:any) {
//     console.error("Error fetching rectangles:", error);
//     return NextResponse.json(
//       { error: `Failed to fetch rectangles ${error.message}` },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = jwt.decode(session.user.accessToken) as { userId: number; role: string };
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user is admin, fetch all rectangles
    if (role === "admin") {
      const rectangles = await prisma.rectangle.findMany({
        include: { shape: true },
      });
      return NextResponse.json(rectangles, { status: 200 });
    }

    // For viewers and editors, fetch all rectangles
    const rectangles = await prisma.rectangle.findMany({
      include: { shape: true },
    });

    return NextResponse.json(rectangles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching rectangles:", error);
    return NextResponse.json(
      { error: `Failed to fetch rectangles ${error.message}` },
      { status: 500 }
    );
  }
}
