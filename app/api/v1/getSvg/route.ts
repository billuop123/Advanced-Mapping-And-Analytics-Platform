import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/services/prismaClient";

export async function GET(req: NextRequest) {
    try {
        const svg = await prisma.sVG.findMany();
        console.log(svg);
        return NextResponse.json(svg);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch SVGs" }, { status: 500 });
    }
}