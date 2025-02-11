// pages/api/auth/setup-security.js
import pool from "../../../utils/db";
import { authMiddleware, hashPassword } from "../../../utils/auth";
import { Resend } from "resend";

import WelcomeEmail from "../../../emailTemplates/welcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function handler(req, res) {
  await authMiddleware(req, res, async () => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
    }

    try {
      const userId = req.user.userId;
      const { securityAnswers, first_name, last_name, email } = req.body;

      if (!first_name || !last_name ) {
        return res.status(400).json({
          success: false,
          error: "First name and last name are required",
        });
      }

      // Validate security answers
      if (!Array.isArray(securityAnswers) || securityAnswers.length < 3) {
        return res.status(400).json({
          success: false,
          error: "At least 3 security questions must be answered",
        });
      }

      // Validate question IDs exist
      const questionIds = securityAnswers.map((a) => a.questionId);
      const [existingQuestions] = await pool.query(
        "SELECT id FROM security_questions WHERE id IN (?)",
        [questionIds]
      );

      if (existingQuestions.length !== questionIds.length) {
        return res.status(400).json({
          success: false,
          error: "One or more invalid security questions",
        });
      }

      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Check if user already has security questions set up
        const [existingAnswers] = await connection.query(
          "SELECT COUNT(*) as count FROM user_security_answers WHERE user_id = ?",
          [userId]
        );

        if (existingAnswers[0].count > 0) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: "Security questions already set up",
          });
        }

        // Insert security answers
        for (const { questionId, answer } of securityAnswers) {
          if (!answer || answer.trim().length < 2) {
            await connection.rollback();
            return res.status(400).json({
              success: false,
              error: "Each answer must be at least 2 characters long",
            });
          }

          const answerHash = await hashPassword(answer.toLowerCase().trim());
          await connection.query(
            `INSERT INTO user_security_answers (user_id, question_id, answer_hash)
             VALUES (?, ?, ?)`,
            [userId, questionId, answerHash]
          );
        }

        // Update user status to active
        await connection.query(
          `UPDATE users SET status = 'active' WHERE id = ? AND status = 'verified'`,
          [userId]
        );

        await connection.commit();

        // Send verification email
        const { data, error } = await resend.emails.send({
          from: "Department of Indigenous Affairs | GoAP <send@vlai.in>",
          to: email,
          subject: "Welcome to the Department of Indigenous Affairs",
          react: WelcomeEmail({
            userName: first_name + " " + last_name,
          }),
        });

        return res.status(200).json({
          success: true,
          message:
            "Security questions set up successfully. Account is now active.",
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Security setup error:", error);
      return res.status(500).json({
        success: false,
        error: "Security setup failed. Please try again later.",
      });
    }
  });
}
