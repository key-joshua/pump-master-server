import { SendMailOptions } from 'nodemailer';

export const verifyAccountTemplate = (receiverEmail: string, action: string, url: string): SendMailOptions => {
    return {
        to: receiverEmail,
        subject: `Pump Master ${action}`,
        from: `Pump Master <${process.env.SMTP_GMAIL_SENDER_EMAIL}>`,
        text: 'Hello From Pump Master, We received a request to verify your account.',
        html: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #e8f4fd 0%, #d6e9f7 100%); min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table style="max-width: 700px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <tr>
                        <td style="background: #082777; padding: 30px 40px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 8px;">
                                <div style="width: 30px; height: 30px; margin-right: 20px; border-radius: 4px; position: relative;">
                                    <img src="https://res.cloudinary.com/donuwgeyj/image/upload/v1750683793/logo_l5zjyb.png" alt="Pump Master Logo" style="width: 30px; height: 30px;" />
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pump Master</h1>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #082777; margin: 0 0 20px 0; font-size: 28px; font-weight: 600; text-align: center;">Verify Account Email Address</h2>
                            
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                Welcome to Pump Master! We're excited to have you join our platform. To complete your registration and access all features, please verify your email address.
                            </p>
                            
                            <div style="text-align: center; margin: 10px 0;">
                                <a href="${url}" style="display: inline-block; background: #082777; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px #9dc2ef; transition: all 0.3s ease;" target="_blank"> Verify Email Address </a>
                            </div>
                            
                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 10px 0;">
                                <p style="color: #5a6c7d; font-size: 14px; margin: 0 0 10px 0; text-align: center;"> If the button above doesn't work, copy and paste this link into your browser: </p>
                                <p style="word-break: break-all; text-align: center; margin: 0;"> <a href="${url}" style="color: #4a90e2; text-decoration: none; font-size: 14px;">${url}</a> </p>
                            </div>
                            <div style="border-left: 4px solid #4a90e2; padding-left: 16px; margin: 30px 0;">
                                <p style="color: #5a6c7d; font-size: 14px; margin: 0; line-height: 1.5;">
                                    <strong>Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account with Pump Master, please ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f8fafc; padding: 10px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;"> Need help? Contact our support team at <a href="mailto:support@hrmanagement.com" style="color: #4a90e2; text-decoration: none;">support@hrmanagement.com</a> </p>
                            <p style="color: #cbd5e1; font-size: 12px; margin: 0;"> © 2024 Pump Master. All rights reserved. </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`,
    };
};

export const resetPasswordTemplate = (receiverEmail: string, action: string, url: string): SendMailOptions => {
    return {
        to: receiverEmail,
        subject: `Pump Master ${action}`,
        from: `Pump Master <${process.env.SMTP_GMAIL_SENDER_EMAIL}>`,
        text: 'Hello from Pump Master. We received a request to reset your password.',
        html: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #e8f4fd 0%, #d6e9f7 100%); min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table style="max-width: 700px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <tr>
                        <td style="background: #082777; padding: 30px 40px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 8px;">
                                <div style="width: 30px; height: 30px; margin-right: 20px; border-radius: 4px; position: relative;">
                                    <img src="https://res.cloudinary.com/donuwgeyj/image/upload/v1750683793/logo_l5zjyb.png" alt="Pump Master Logo" style="width: 30px; height: 30px;" />
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pump Master</h1>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #082777; margin: 0 0 20px 0; font-size: 28px; font-weight: 600; text-align: center;">Reset Your Password</h2>
                            
                            <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                                We received a request to reset the password for your Pump Master account. Click the button below to set a new password for your account.
                            </p>
                            
                            <div style="text-align: center; margin: 10px 0;">
                                <a href="${url}" style="display: inline-block; background: #082777; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px #9dc2ef; transition: all 0.3s ease;" target="_blank">Reset Password</a>
                            </div>
                            
                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 10px 0;">
                                <p style="color: #5a6c7d; font-size: 14px; margin: 0 0 10px 0; text-align: center;">If the button above doesn't work, copy and paste this link into your browser:</p>
                                <p style="word-break: break-all; text-align: center; margin: 0;">
                                    <a href="${url}" style="color: #4a90e2; text-decoration: none; font-size: 14px;">${url}</a>
                                </p>
                            </div>
                            
                            <div style="border-left: 4px solid #082777; padding-left: 16px; margin: 30px 0; background-color: #08277714;">
                                <p style="color: #5a6c7d; font-size: 14px; margin: 0; line-height: 1.5;">
                                    <strong>Important:</strong> This password reset link will expire in 1 hour for your security. If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.
                                </p>
                            </div>
                            
                            <div style="border-left: 4px solid #f39c12; padding-left: 16px; margin: 20px 0; background-color: #fefbf3;">
                                <p style="color: #5a6c7d; font-size: 14px; margin: 0; line-height: 1.5;">
                                    <strong>Security Tip:</strong> After resetting your password, we recommend using a strong, unique password and enabling two-factor authentication for enhanced security.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f8fafc; padding: 10px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">
                                Need help? Contact our support team at 
                                <a href="mailto:support@hrmanagement.com" style="color: #4a90e2; text-decoration: none;">support@hrmanagement.com</a>
                            </p>
                            <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                                © 2024 Pump Master. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`,
    };
};
