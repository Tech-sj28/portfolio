// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // to load .env variables

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from all origins (dev only)
app.use(express.json()); // Parse JSON body

// Contact form endpoint
app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,         
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.ROYAL_EMAIL, // your email
      pass: process.env.SMTP_PASS,   // app password or SMTP password
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.ROYAL_EMAIL}>`,
    to: process.env.ROYAL_EMAIL,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${email}`);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});