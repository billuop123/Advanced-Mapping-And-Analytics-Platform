// import { prisma } from "../services/prismaClient";
// import bcryptjs from "bcrypt";
// import nodemailer from "nodemailer" 
// export const  sendEmail = async ({ email, emailType, userId }: any) => {
//   try {
//     // Hashing the userId for the token
//     console.log("--------------------1")
//     console.log(userId)
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     // Find the user by their ID and update the user's record
//     if(emailType==="VERIFY"){
//     const updatedUser = await prisma.user.update({
//       where: { id: Number(userId) }, 
//       data: {
       
//         verifiedToken: hashedToken, 
//         verifiedTokenExpiry:new Date(Date.now()+3600000)
//       },
//     });
//     console.log(updatedUser)
//     }

// var transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "7671a02e18fb51",
//       pass: "02589374dba184"
//     }
//   });
//   const emailContent = `
//   <p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">
//     here
//   </a> to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"}</p>
// `;


//   const mailOptions={
//     from:"map@gmail.com",
//     to:email,
//     subject:"verify your email",
//     html:`${emailContent}`
//   }
//   const mailresponse =await transport.sendMail(mailOptions);
//   return mailresponse
//   } catch (e: any) {
//     throw new Error(e.message);
//   }
// };
import { prisma } from "../services/prismaClient";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

interface EmailOptions {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
  try {
    console.log("📨 Sending email to:", email);
    console.log("User ID:", userId);

    // Generate a hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Update user record based on email type
    const updateData: any = {
      verifiedToken: hashedToken,
      verifiedTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
    };

    if (emailType === "RESET") {
      updateData.resetToken = hashedToken;
      updateData.resetTokenExpiry = new Date(Date.now() + 3600000);
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });
    console.log(process.env.SMTP_USER,process.env.SMTP_PASS)
    // Configure Gmail SMTP Transport
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email Content
    const actionText = emailType === "VERIFY" ? "Verify your email" : "Reset your password";
    const emailContent = `
      <p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">
        here
      </a> to ${actionText}.</p>
    `;

    // Mail Options
    const mailOptions = {
      from: `"Map App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: actionText,
      html: emailContent,
    };

    // Send Email
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", mailResponse.messageId);
    return mailResponse;
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(error.message);
  }
};
