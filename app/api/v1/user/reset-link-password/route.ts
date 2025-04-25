import { prisma } from "@/app/services/prismaClient";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
    try {
        const { token, password } = await req.json();

        // Find user with matching reset token
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

        // Verify the token
        const isValidToken = await bcrypt.compare(token, user.resetToken!);
        if (!isValidToken) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear reset token
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