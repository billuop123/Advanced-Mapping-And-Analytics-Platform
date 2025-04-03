import { sendEmail } from "@/app/helperFunctions/mailer"
import { prisma } from "@/app/services/prismaClient"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const {email,userId}=await req.json()
        const user=await prisma.user.findFirst({
            where:{
                email,
                isVerified:true
            }
        })
        if(user){
            return NextResponse.json({
                message:"User is already verified"
            })
        }
        if(!email || userId){
            NextResponse.json({
                message:"There is no email or user Id"
            })
        }
        sendEmail({email,emailType:"VERIFY",userId})
        return NextResponse.json({
            message:"Email successfully sent"
        })
    }catch(e){
        NextResponse.json({
            Error:"Failed to send Email"
        })
    }
}