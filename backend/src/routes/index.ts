import { Router } from "express";
import { getGrid } from "../controllers/gridController.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { getStats } from "../controllers/statsController.js";

const router = Router();

router.get("/grid", getGrid);
router.get("/leaderboard", getLeaderboard);
router.get("/stats", getStats);

export default router;
