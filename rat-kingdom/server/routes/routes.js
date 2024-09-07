import { Router } from "express";
import { createUser, getUser, completeTask, getUserTasks, claimRewards, getUserFrens, getLeaderboard } from "../controllers/userControllers.js";

const router = Router();

router.get("/api/v1/getLeaderboard", getLeaderboard)
//router.get("/api/v1/users", getUsers );
router.post("/api/v1/createUser", createUser );
router.post("/api/v1/completeTask", completeTask );
router.get("/api/v1/users/:id", getUser);
router.get("/api/v1/userTasks/:telegramId", getUserTasks);
router.post("/api/v1/claimRewards", claimRewards);
router.get("/api/v1/userFrens/:telegramId", getUserFrens);

export default router;