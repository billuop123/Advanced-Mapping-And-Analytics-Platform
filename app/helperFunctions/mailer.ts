import { prisma } from "../services/prismaClient";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config(); 

interface EmailOptions {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
  try {
    console.log("📨 Sending email to:", email);
    
 
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    
    const updateData: any = {
      verifiedToken: emailType === "VERIFY" ? hashedToken : undefined,
      verifiedTokenExpiry: emailType === "VERIFY" ? new Date(Date.now() + 3600000) : undefined,
      resetToken: emailType === "RESET" ? hashedToken : undefined,
      resetTokenExpiry: emailType === "RESET" ? new Date(Date.now() + 3600000) : undefined,
    };

    await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const actionText = emailType === "VERIFY" ? "Verify your email" : "Reset your password";
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${actionText}</h2>
        <p>Hello,</p>
        <p>We received a request to ${actionText.toLowerCase()} for your account.</p>
        <p>Click the button below to proceed:</p>
        <a href="${process.env.domain}/${emailType === "VERIFY" ? "verifyemail" : "reset-link-password"}?token=${token}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          ${actionText}
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Map App Team</p>
      </div>
    `;

    const mailOptions = {
      from: `"Map App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: actionText,
      html: emailContent,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", mailResponse.messageId);
    return mailResponse;

  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(error.message);
  }
};
