// pages/api/auth/verify-email.js
import pool from '../../../utils/db';
import { generateJWT } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    const [users] = await pool.query(
      `SELECT id, role_id FROM users 
       WHERE email = ? 
       AND reset_token = ? 
       AND reset_token_expires > NOW()
       AND status = 'unverified'`,
      [email, code]
    );

    if (!users.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code',
      });
    }

    const user = users[0];

    // Update status to verified and clear verification code
    await pool.query(
      `UPDATE users 
       SET status = 'verified',
           reset_token = NULL, 
           reset_token_expires = NULL 
       WHERE id = ?`,
      [user.id]
    );

    // Generate JWT token
    const token = generateJWT(user.id, user.role_id);

    return res.status(200).json({
      success: true,
      token,
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed. Please try again later.',
    });
  }
}