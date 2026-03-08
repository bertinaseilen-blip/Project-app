import { randomUUID } from "crypto";
import express from "express";
import authenticate from "../modules/auth.mjs";
import {
  createReminder,
  getRemindersForUser,
  completeReminder
} from "../dataObjects/reminder.mjs";

const reminderRouter = express.Router();

reminderRouter.use(express.json());

reminderRouter.get("/", authenticate, async (req, res) => {
  console.log("Incoming GET /api/reminders for user:", req.userId);

  try {
    const reminders = await getRemindersForUser(req.userId);
    console.log("Reminders fetched:", reminders);
    res.json(reminders);
  } catch (err) {
    console.error("GET reminders error:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// CREATE REMINDER
reminderRouter.post("/", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title required" });
    }

    const reminder = await createReminder(
      randomUUID(),
      req.userId, // always the authenticated user
      title,
      description || ""
    );

    res.status(201).json(reminder);
  } catch (err) {
    console.error("CREATE reminder error:", err);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

// COMPLETE REMINDER
reminderRouter.put("/:id/complete", authenticate, async (req, res) => {
  try {
    await completeReminder(req.params.id, req.userId);
    res.json({ message: "Reminder completed" });
  } catch (err) {
    console.error("COMPLETE reminder error:", err);
    res.status(500).json({ error: "Failed to complete reminder" });
  }
});

export default reminderRouter;