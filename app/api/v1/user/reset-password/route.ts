import { prisma } from "@/app/services/prismaClient"
import { NextResponse } from "next/server"
import { sendEmail } from "@/app/helperFunctions/mailer"

export const POST = async (req:Request,res:Response)=>{
    const {email}=await req.json()
    try{
        const user=await prisma.user.findFirst({where:{email}})
        if(!user){
            return NextResponse.json({message:"user not found"})
        }
        
 
        await sendEmail({
            email,
            emailType:"RESET",
            userId:user.id.toString()
        })
        
        return NextResponse.json({message:"reset password link sent in your email"})
    }catch(error:any){
        console.error("Reset password error:", error)
        return NextResponse.json({message:`error ${error.message}`}, {status:500})
    }
}