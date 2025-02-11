// pages/api/auth/register.js
import pool from "../../../utils/db";
import { generateOTP, hashPassword } from "../../../utils/auth";
import { Resend } from "resend";
import SendOtpEmail from "../../../emailTemplates/sendOtpEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { first_name, last_name, email, phone, password } = req.body;

    // Generate registration number
    const regNumber = "REG" + Date.now().toString().slice(-6);

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate OTP for email verification
    const verificationCode = generateOTP();

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert user with default guest role (8)
      const [result] = await connection.query(
        `INSERT INTO users (registration_number, email, password_hash, first_name, last_name, phone, role_id, status)
         VALUES (?, ?, ?, ?, ?, ?, 8, 'unverified')`,
        [regNumber, email, passwordHash, first_name, last_name, phone]
      );

      // Store verification code (you might want to create a separate table for this)
      // For now, we'll use the reset_token field
      await connection.query(
        `UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
         WHERE id = ?`,
        [verificationCode, result.insertId]
      );

      await connection.commit();
      console.log(verificationCode)

      // Send verification email
      const { data, error } = await resend.emails.send({
        from: 'Department of Indigenous Affairs | GoAP <send@vlai.in>',
        to: email,
        subject: "Verify your email",
        react: SendOtpEmail({
          //   first_name,
          validationCode: verificationCode,
        }),
      });

      return res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for verification.",
        sendId: data.id,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      error: "Registration failed. Please try again later.",
    });
  }
}
