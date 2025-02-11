// pages/api/admin/security-questions.js
import pool from "../../../utils/db";
import { authMiddleware } from "../../../utils/auth";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
    //   if (req.user.role !== 1) {
    //     // Admin role check
    //     return res.status(403).json({ success: false, error: "Unauthorized" });
    //   }
      return await createSecurityQuestion(req, res);
    case "GET":
      return await getSecurityQuestions(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}

// Create new security question
async function createSecurityQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question || question.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Question must be at least 10 characters long",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO security_questions (question) VALUES (?)",
      [question.trim()]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        question: question.trim(),
      },
    });
  } catch (error) {
    console.error("Create security question error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create security question",
    });
  }
}

// Get all security questions
async function getSecurityQuestions(req, res) {
  try {
    const [questions] = await pool.query(
      "SELECT id, question, created_at FROM security_questions ORDER BY created_at DESC"
    );

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Get security questions error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch security questions",
    });
  }
}
