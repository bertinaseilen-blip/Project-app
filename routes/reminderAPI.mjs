import { randomUUID } from "crypto";
import express from "express";
import authenticate from "../modules/auth.mjs";
import {
  createReminder,
  getRemindersForUser,
  completeReminder,
  deleteReminder,
  updateReminder
} from "../dataObjects/reminder.mjs";

const reminderRouter = express.Router();

reminderRouter.use(express.json());

reminderRouter.get("/", authenticate, async (req, res) => {
  
  try {
    const reminders = await getRemindersForUser(req.userId);


    const grouped = {};

    for (const reminder of reminders) {
      const category = reminder.category || "";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(reminder);
    }
    //console.log("Reminders fetched:", reminders);
    
    res.json(reminders);
  } catch (err) {
    console.error("GET reminders error:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// CREATE REMINDER
reminderRouter.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title required" });
    }

    const reminder = await createReminder(
      randomUUID(),
      req.userId,
      title,
      description || "",
      category || ""
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

reminderRouter.delete("/:id", authenticate, async (req, res) => {
  try {
    await deleteReminder(req.params.id, req.userId);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("DELETE reminder error:", err);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
});

reminderRouter.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const updated = await updateReminder(
      req.params.id,
      req.userId,
      title,
      description,
      category
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE reminder error:", err);
    res.status(500).json({ error: "Failed to update reminder" });
  }
});
export default reminderRouter;