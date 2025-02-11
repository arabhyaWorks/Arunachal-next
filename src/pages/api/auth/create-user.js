// pages/api/admin/create-user.js
// import {  from '../../../utils/db';
import pool from '../../../utils/db';
import { authMiddleware, hashPassword } from '../../../utils/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  await authMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Check if the requesting user has admin privileges
    if (req.user.role !== 1) { // Assuming role_id 1 is admin
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const { firstName, lastName, email, phone, password, roleId } = req.body;

      // Generate registration number
      const regNumber = 'REG' + Date.now().toString().slice(-6);
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Insert user with specified role
        const [result] = await connection.query(
          `INSERT INTO users (registration_number, email, password_hash, first_name, last_name, phone, role_id, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'verified')`,
          [regNumber, email, passwordHash, firstName, lastName, phone, roleId]
        );

        await connection.commit();

        // Send welcome email with credentials
        await resend.emails.send({
          from: 'welcome@yourdomain.com',
          to: email,
          subject: 'Welcome to Indigenous Folklore Portal',
          react: WelcomeTemplate({
            firstName,
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
  });
}