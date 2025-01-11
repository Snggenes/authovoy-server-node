import "dotenv/config";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.BREVO_SERVER,
  port: parseInt(process.env.BREVO_PORT!),
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.BREVO_USERNAME,
    pass: process.env.BREVO_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Zetauth" <${process.env.BREVO_MAILBOX}>`,
      to,
      subject,
      text,
    });
    console.log(`Message sent: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const sendVerificationEmail = async (to: string, number: number) => {
  const subject = "Verify your email";
  const text = `Your verification code is ${number}`;

  const result = await sendEmail(to, subject, text);
  if (!result.success) {
    return { success: false, message: "Failed to send verification email" };
  }

  return { success: true, message: "Verification email sent" };
};
