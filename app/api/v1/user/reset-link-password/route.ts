import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
    try {
        const { token, password } = await req.json();

 
        const user = await prisma.user.findFirst({
            where: {
                resetToken: {
                    not: null
                },
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

 
        const isValidToken = await bcrypt.compare(token, user.resetToken!);
        if (!isValidToken) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

  
        const hashedPassword = await bcrypt.hash(password, 10);

       
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}; 