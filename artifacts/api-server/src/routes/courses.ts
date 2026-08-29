import { Router, type Request, type Response } from "express";
import { db, coursesTable, enrollmentsTable, quizSubmissionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/courses - List all pathways
router.get("/courses", async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "usr_ananya_sharma";
    const courses = await db.select().from(coursesTable);
    const enrollments = await db
      .select()
      .from(enrollmentsTable)
      .where(eq(enrollmentsTable.userId, userId));

    const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));

    const withProgress = courses.map((c) => {
      const enr = enrollmentMap.get(c.id);
      return {
        ...c,
        progress: enr ? enr.progress : 0,
        enrolled: !!enr,
      };
    });

    res.json(withProgress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses", details: String(error) });
  }
});

// GET /api/courses/:id - Get single pathway
router.get("/courses/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const course = await db.select().from(coursesTable).where(eq(coursesTable.id, id)).limit(1);
    if (!course[0]) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json(course[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course", details: String(error) });
  }
});

// POST /api/courses/:id/enroll - Enroll in pathway
router.post("/courses/:id/enroll", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { userId = "usr_ananya_sharma" } = req.body;

    const existing = await db
      .select()
      .from(enrollmentsTable)
      .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, id)))
      .limit(1);

    if (existing[0]) {
      res.json({ message: "Already enrolled", enrollment: existing[0] });
      return;
    }

    const inserted = await db
      .insert(enrollmentsTable)
      .values({
        userId,
        courseId: id,
        progress: 1,
        completed: false,
      })
      .returning();

    res.status(201).json({ message: "Enrolled successfully", enrollment: inserted[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll in course", details: String(error) });
  }
});

// POST /api/courses/:id/quiz - Submit quiz
router.post("/courses/:id/quiz", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { userId = "usr_ananya_sharma", score } = req.body;

    const passed = Number(score) >= 75;

    const inserted = await db
      .insert(quizSubmissionsTable)
      .values({
        userId,
        courseId: id,
        score: Number(score),
        passed,
      })
      .returning();

    if (passed) {
      await db
        .update(enrollmentsTable)
        .set({ progress: 100, completed: true })
        .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, id)));
    }

    res.status(201).json({
      submission: inserted[0],
      passed,
      certificateUnlocked: passed,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit quiz", details: String(error) });
  }
});

export default router;
