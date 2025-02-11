// utils/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../utils/db';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateJWT = (userId, role, requiresSecuritySetup = false) => {
  return jwt.sign(
    { 
      userId, 
      role,
      requiresSecuritySetup 
    },
    process.env.JWT_SECRET,
    { expiresIn: requiresSecuritySetup ? '1h' : '24h' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Session middleware for API routes
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};