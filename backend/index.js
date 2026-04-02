import nodemailer from "nodemailer";

// Serverless function handler
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create transporter for SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,        // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587, // 465 for SSL, 587 for TLS
      secure: process.env.SMTP_PORT == 465, // true for 465
      auth: {
        user: process.env.ROYAL_EMAIL,    // your email
        pass: process.env.SMTP_PASS,      // App password (Gmail 2FA required)
      },
    });

    // Optional: verify SMTP connection
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.ROYAL_EMAIL}>`,
      to: process.env.ROYAL_EMAIL,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${email}`);

    return res.status(200).json({ message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "❌ Failed to send email" });
  }
}