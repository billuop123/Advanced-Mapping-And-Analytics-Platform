import { prisma } from "@/app/services/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {userId} = await request.json();
    try{

 
    const user = await prisma.user.findFirst({
        where:{
            id:Number(userId)
        }
    })
    if(!user) {
        return NextResponse.json({
            isVerified: false
        })
    }
    const isVerified = user.isVerified;
    if(!isVerified){
        return NextResponse.json({
            isVerified:false
        })
    }
    else{
        return NextResponse.json({
            isVerified:true
        })
    }}catch(err:any){
        return NextResponse.json({
            Error:`${err.message}`
        })
    }
}