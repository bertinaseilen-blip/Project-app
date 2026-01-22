import express from "express";
import { middlewareTask } from "../modules/middlewareTask.mjs";

const router = express.Router();

router.put("/task", middlewareTask, (req, res) => {
    res.send("Task updated");
});

export default router;
