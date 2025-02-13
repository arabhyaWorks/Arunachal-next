import pool from '../../../utils/db';
import { authMiddleware, hashPassword } from '../../../utils/auth';
import { Resend } from 'resend';
import WelcomeCreds from "../../../emailTemplates/WelcomeCreds";


const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { first_name, last_name, email, phone, password, role_id } = req.body;
    console.log(req.body);

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // First check if email exists
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'This email is already registered. Please login instead.'
        });
      }

      // Generate registration number
      const regNumber = 'REG' + Date.now().toString().slice(-6);
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Start transaction
      await connection.beginTransaction();

      // Insert user with specified role
      const [result] = await connection.query(
        `INSERT INTO users (registration_number, email, password_hash, first_name, last_name, phone, role_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'verified')`,
        [regNumber, email, passwordHash, first_name, last_name, phone, role_id]
      );

      await connection.commit();

      // Send welcome email with credentials
      await resend.emails.send({
        from: 'Department of Indigenous Affairs | GoAP <send@vlai.in>',
        to: email,
        subject: 'Welcome to Indigenous Folklore Portal',
        react: WelcomeCreds({
          name: first_name + " " + last_name,
          email,
          password,
          loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        }),
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully. Welcome email sent.',
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('User creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'User creation failed. Please try again later.',
    });
  }
}