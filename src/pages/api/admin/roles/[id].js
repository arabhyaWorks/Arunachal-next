
import pool from '../../../../utils/db';
import { authMiddleware } from '../../../../utils/auth';

export default async function handler(req, res) {
  // await authMiddleware(req, res, async () => {
    const { id } = req.query;

    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (req.user.role !== 1) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }

    const connection = await pool.getConnection();

    try {
      // GET: Fetch single role
      if (req.method === 'GET') {
        const [roles] = await connection.query(
          'SELECT * FROM roles WHERE id = ?',
          [id]
        );

        if (!roles.length) {
          return res.status(404).json({
            success: false,
            error: 'Role not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: roles[0]
        });
      }

      // PUT: Update role
      if (req.method === 'PUT') {
        const { name, description, permissions } = req.body;

        // Check if role exists
        const [existingRole] = await connection.query(
          'SELECT id FROM roles WHERE id = ?',
          [id]
        );

        if (!existingRole.length) {
          return res.status(404).json({
            success: false,
            error: 'Role not found'
          });
        }

        // Check if new name conflicts with existing role
        if (name) {
          const [nameCheck] = await connection.query(
            'SELECT id FROM roles WHERE name = ? AND id != ?',
            [name, id]
          );

          if (nameCheck.length > 0) {
            return res.status(400).json({
              success: false,
              error: 'Role name already exists'
            });
          }
        }

        // Update role
        await connection.query(
          `UPDATE roles 
           SET name = COALESCE(?, name),
               description = COALESCE(?, description),
               permissions = COALESCE(?, permissions)
           WHERE id = ?`,
          [name, description, permissions ? JSON.stringify(permissions) : null, id]
        );

        return res.status(200).json({
          success: true,
          message: 'Role updated successfully'
        });
      }

      // DELETE: Delete role and update users
      if (req.method === 'DELETE') {
        await connection.beginTransaction();

        try {
          // Get guest role ID (assuming it's role_id 8 as per your schema)
          const GUEST_ROLE_ID = 8;

          // Update users with this role to guest role
          await connection.query(
            'UPDATE users SET role_id = ? WHERE role_id = ?',
            [GUEST_ROLE_ID, id]
          );

          // Delete the role
          await connection.query('DELETE FROM roles WHERE id = ?', [id]);

          await connection.commit();

          return res.status(200).json({
            success: true,
            message: 'Role deleted successfully. Associated users updated to guest role.'
          });
        } catch (error) {
          await connection.rollback();
          throw error;
        }
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