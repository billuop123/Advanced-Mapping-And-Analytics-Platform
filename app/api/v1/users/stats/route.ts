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
        const totalUsers = await prisma.user.count();
        const editorUsers = await prisma.user.count({
            where: {
                role: "editor"
            }
        });
        const viewerUsers = await prisma.user.count({
            where: {
                role: "viewer"
            }
        });
        const totalSVGs = await prisma.sVG.count();
        const totalRectangles = await prisma.rectangle.count();
        const totalCircles = await prisma.circle.count();
        const totalLines = await prisma.polyline.count();
        const totalPolygons = await prisma.polygon.count();
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
        console.log(admin)
        return NextResponse.json({
            totalUsers,
            editorUsers,
            viewerUsers,
            totalSVGs,
            totalRectangles,
            totalCircles,
            totalLines,
            totalPolygons,
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