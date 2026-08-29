import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cyclonesRouter from "./cyclones";
import forecastsRouter from "./forecasts";
import duelsRouter from "./duels";
import warzoneRouter from "./warzone";
import alertsRouter from "./alerts";
import groundReportsRouter from "./groundReports";
import leaderboardRouter from "./leaderboard";
import coursesRouter from "./courses";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cyclonesRouter);
router.use(forecastsRouter);
router.use(duelsRouter);
router.use(warzoneRouter);
router.use(alertsRouter);
router.use(groundReportsRouter);
router.use(leaderboardRouter);
router.use(coursesRouter);
router.use(profileRouter);

export default router;
