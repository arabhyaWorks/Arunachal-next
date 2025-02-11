// pages/api/auth/login.js
import pool from '../../../utils/db';
import { comparePassword, generateJWT } from '../../../utils/auth';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30; // minutes

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get user with their role
      const [users] = await connection.query(
        `SELECT u.*, r.name as role_name, r.permissions 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ?`,
        [email]
      );

      const user = users[0];

      if (!user) {
        await connection.commit();
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if account is blocked or suspended
      if (user.status === 'blocked' || user.status === 'suspended') {
        await connection.commit();
        return res.status(403).json({
          success: false,
          error: `Account is ${user.status}. Please contact administrator.`
        });
      }

      // Check login attempts
      if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {
        const lastLoginAttempt = new Date(user.last_login || Date.now());
        const lockoutTime = new Date(lastLoginAttempt.getTime() + LOCKOUT_DURATION * 60000);
        
        if (lockoutTime > new Date()) {
          await connection.commit();
          return res.status(429).json({
            success: false,
            error: `Too many failed attempts. Please try again after ${LOCKOUT_DURATION} minutes.`
          });
        } else {
          // Reset login attempts after lockout period
          await connection.query(
            'UPDATE users SET login_attempts = 0 WHERE id = ?',
            [user.id]
          );
        }
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password_hash);

      if (!isValidPassword) {
        // Increment login attempts
        await connection.query(
          'UPDATE users SET login_attempts = login_attempts + 1, last_login = NOW() WHERE id = ?',
          [user.id]
        );
        
        await connection.commit();
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if security questions are set up for verified users
      if (user.status === 'verified') {
        const [securityAnswers] = await connection.query(
          'SELECT COUNT(*) as count FROM user_security_answers WHERE user_id = ?',
          [user.id]
        );

        if (securityAnswers[0].count === 0) {
          // Generate special JWT for security setup
          const token = generateJWT(user.id, user.role_id, true);
          await connection.commit();
          return res.status(200).json({
            success: true,
            requiresSecuritySetup: true,
            token,
            message: 'Please set up security questions'
          });
        }
      }

      // If all checks pass, reset login attempts and update last login
      await connection.query(
        'UPDATE users SET login_attempts = 0, last_login = NOW() WHERE id = ?',
        [user.id]
      );

      // Generate JWT token
      const token = generateJWT(user.id, user.role_id);

      await connection.commit();


      // Return success with user info and token
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role_name,
          permissions: user.permissions,
          status: user.status
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again later.'
    });
  }
}