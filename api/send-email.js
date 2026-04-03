import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check env variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Email credentials missing" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Message from ${name}`,
      text: message,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}