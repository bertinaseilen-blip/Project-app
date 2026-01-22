import express from "express";
import { middlewareTask } from "../modules/middlewareTask.mjs";

const router = express.Router();

router.put("/task", taskCompletionMiddleware, (req, res) => {
    res.send("Task updated");
});

export default router;
