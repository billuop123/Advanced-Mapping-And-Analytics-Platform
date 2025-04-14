import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(options);
        
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get total number of users
        const totalUsers = await prisma.user.count();

        // Get total number of SVG uploads
        const totalSVGs = await prisma.sVG.count();

        // Get admin information
        const admin = await prisma.user.findFirst({
            where: {
                email: session.user?.email
            },
            select: {
                name: true,
                email: true,
                image: true
            }
        });

        return NextResponse.json({
            totalUsers,
            totalSVGs,
            adminName: admin?.name || "",
            adminEmail: admin?.email || "",
            adminImage: admin?.image || "/default.svg"
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch user statistics" },
            { status: 500 }
        );
    }
} 