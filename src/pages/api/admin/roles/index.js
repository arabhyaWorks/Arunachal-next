import pool from '../../../../utils/db';
import { authMiddleware } from '../../../../utils/auth';

export default async function handler(req, res) {
  // await authMiddleware(req, res, async () => {
    // Only allow GET and POST methods
    if (!['GET', 'POST'].includes(req.method)) {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // // Check if the requesting user has admin privileges
    // if (req.user.role !== 1) {
    //   return res.status(403).json({ success: false, error: 'Unauthorized access' });
    // }

    const connection = await pool.getConnection();

    try {
      // GET: Fetch all roles
      if (req.method === 'GET') {
        const [roles] = await connection.query(
          'SELECT * FROM roles ORDER BY created_at DESC'
        );

        return res.status(200).json({
          success: true,
          data: roles
        });
      }

      // POST: Create new role
      if (req.method === 'POST') {
        const { name, description, permissions } = req.body;

        // Validate required fields
        if (!name || !permissions) {
          return res.status(400).json({
            success: false,
            error: 'Name and permissions are required'
          });
        }

        // Check if role name already exists
        const [existingRole] = await connection.query(
          'SELECT id FROM roles WHERE name = ?',
          [name]
        );

        if (existingRole.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Role name already exists'
          });
        }

        // Insert new role
        const [result] = await connection.query(
          'INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)',
          [name, description, JSON.stringify(permissions)]
        );

        return res.status(201).json({
          success: true,
          message: 'Role created successfully',
          data: {
            id: result.insertId,
            name,
            description,
            permissions
          }
        });
      }

    } catch (error) {
      console.error('Role operation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Operation failed. Please try again later.'
      });
    } finally {
      connection.release();
    }
  // });
}

// pages/api/admin/roles/[id].js