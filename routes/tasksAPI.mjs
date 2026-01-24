import express from "express";
import { middlewareTask } from "../modules/middlewareTask.mjs";

const router = express.Router();

router.get("/tasks", (req, res) => {
  res.send("Get all tasks");
});

router.get("/tasks/:id", (req, res) => {
  res.send(`Get task with id ${req.params.id}`);
});

router.post("/tasks", (req, res) => {
  res.send("Create a new task");
});

router.put("/tasks/:id", middlewareTask, (req, res) => {
  res.send(`Update task with id ${req.params.id}`);
});

router.delete("/tasks/:id", (req, res) => {
  res.send(`Delete task with id ${req.params.id}`);
});

export default router;
