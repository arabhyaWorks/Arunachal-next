import pool from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  try {
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // First delete related records from user_security_answers
      await connection.query(
        'DELETE FROM user_security_answers WHERE user_id = ?',
        [id]
      );

      // Delete user audit logs
      await connection.query(
        'DELETE FROM user_audit_logs WHERE user_id = ?',
        [id]
      );

      // Delete notifications
      await connection.query(
        'DELETE FROM notifications WHERE user_id = ?',
        [id]
      );

      // Delete committee members
      await connection.query(
        'DELETE FROM committee_members WHERE user_id = ?',
        [id]
      );

      // Finally delete the user
      const [result] = await connection.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user. Please try again later.'
    });
  }
}