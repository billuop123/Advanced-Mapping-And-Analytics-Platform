import { prisma } from "@/app/services/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log('-------------')
    console.log(token)

 
    const users = await prisma.user.findMany({
      where: {
        verifiedToken: {
          not: null
        }
      },
    });


    let user = null;
    for (const potentialUser of users) {
      if (potentialUser.verifiedToken) {
        const isValidToken = await bcrypt.compare(token, potentialUser.verifiedToken);
        if (isValidToken) {
          user = potentialUser;
          break;
        }
      }
    }

    console.log(user);

    if (!user) {
      return NextResponse.json({
        message: "User not found or invalid token",
      }, { status: 404 });
    }

    if (user.verifiedTokenExpiry && new Date(user.verifiedTokenExpiry).getTime() < Date.now()) {
      return NextResponse.json({
        message: "Token has expired",
      }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id }, 
      data: {
        isVerified: true,
        verifiedToken: null, 
        verifiedTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Token is valid, user verified successfully",
      user: updatedUser, 
    }, { status: 200 });

  } catch (e:any) {
    console.error(e);
    return NextResponse.json({
      message: `Error verifying token ${e.message}`,
    }, { status: 500 });
  }
}
