import nodemailer from "nodemailer";

export default async function handler(req, res) {
  console.log("API called with body:", req.body);

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });

  console.log("ENV VARS:", {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    ROYAL_EMAIL: process.env.ROYAL_EMAIL,
    SMTP_PASS_EXISTS: !!process.env.SMTP_PASS,
  });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.ROYAL_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify(); // Will throw if SMTP fails
    console.log("SMTP connection OK");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.ROYAL_EMAIL}>`,
      to: process.env.ROYAL_EMAIL,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    });

    console.log("Email sent successfully");
    return res.status(200).json({ message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("SMTP error:", error);
    return res.status(500).json({ error: `❌ Failed to send email: ${error.message}` });
  }
}