import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { verifyAccountTemplate, resetPasswordTemplate } from '../utils/emailTemplateUtils';

dotenv.config();
export interface EmailInterface { receiverEmail: string; action: string; url?: string; data?: any; otp?: any; }

export const sendEmail = async (email: EmailInterface): Promise<void> => {
  try {
    const transporter = await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_HOST_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_GMAIL_SENDER_EMAIL,
        pass: process.env.SMTP_GMAIL_SENDER_PASSWORD
      },
    });

    if(email?.action ==='Reset Password') return await transporter.sendMail(resetPasswordTemplate(email?.receiverEmail, email?.action, email?.url));
    if(email?.action ==='Verification Account') return await transporter.sendMail(verifyAccountTemplate(email?.receiverEmail, email?.action, email?.url));
  } catch (error) {
      console.log('Error while sending Email', error);
  }
};
