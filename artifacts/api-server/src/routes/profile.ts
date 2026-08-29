import { Router, type Request, type Response } from "express";
import { db, usersTable, enrollmentsTable, quizSubmissionsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/profile - Fetch active user profile
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "usr_ananya_sharma";
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user[0]) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const completedQuizzes = await db
      .select({
        courseId: quizSubmissionsTable.courseId,
        score: quizSubmissionsTable.score,
        passed: quizSubmissionsTable.passed,
        submittedAt: quizSubmissionsTable.submittedAt,
        courseTitle: coursesTable.title,
      })
      .from(quizSubmissionsTable)
      .leftJoin(coursesTable, eq(quizSubmissionsTable.courseId, coursesTable.id))
      .where(eq(quizSubmissionsTable.userId, userId));

    res.json({
      ...user[0],
      certificates: completedQuizzes.filter((q) => q.passed),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile", details: String(error) });
  }
});

// PUT /api/profile - Update user profile
router.put("/profile", async (req: Request, res: Response) => {
  try {
    const { userId = "usr_ananya_sharma", name, role, region, email } = req.body;

    const updated = await db
      .update(usersTable)
      .set({
        ...(name && { name }),
        ...(role && { role }),
        ...(region && { region }),
        ...(email && { email }),
      })
      .where(eq(usersTable.id, userId))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile", details: String(error) });
  }
});

export default router;
