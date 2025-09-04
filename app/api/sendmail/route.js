import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { recipient, subject, message } = await request.json();

    console.log(`sendmail post: ${recipient}, ${subject} ${message}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PSWD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error sending email." },
      { status: 500 }
    );
  }
}
