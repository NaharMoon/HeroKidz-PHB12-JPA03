import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !to) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"HeroKidz" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { skipped: false };
};
