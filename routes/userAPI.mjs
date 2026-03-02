import express from "express";
import { createUser, deleteUser, getUsers } from "../dataObjects/user.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

/* ------------------ CREATE USER ------------------ */
userRouter.post("/", async (req, res) => {
  try {
    const { username, consentToToS } = req.body;

    const user = await createUser(username, consentToToS);

    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ------------------ DELETE USER ------------------ */
userRouter.delete("/:id", async (req, res) => {
  try {
    const success = await deleteUser(req.params.id);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted and consent withdrawn"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ GET USERS ------------------ */
userRouter.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default userRouter;
