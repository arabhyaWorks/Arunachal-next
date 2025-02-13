import pool from '../../../../utils/db';
import { authMiddleware } from '../../../../utils/auth';

export default async function handler(req, res) {
//   await authMiddleware(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }


    // if (req.user.role !== 1) { 
    //   return res.status(403).json({ success: false, error: 'Unauthorized access' });
    // }

    try {
      const connection = await pool.getConnection();
      
      try {
        // Get all users with their role information
        const [users] = await connection.query(`
          SELECT 
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.registration_number,
            u.role_id,
            r.name as role_name,
            u.last_login,
            u.profile_image_url,
            u.status
          FROM users u
          JOIN roles r ON u.role_id = r.id
          ORDER BY u.id DESC
        `);

        return res.status(200).json({
          success: true,
          data: users
        });

      } catch (error) {
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users. Please try again later.'
      });
    }
//   });
}