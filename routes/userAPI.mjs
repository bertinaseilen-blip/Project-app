import express from "express";
import { createUser, deleteUser, getUsers } from "../dataObjects/user.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", (req, res) => {
  try {
    const { username, consentToToS } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long"
      });
    }

    if (!consentToToS) {
      return res.status(400).json({
        error: "You must agree to the Terms of Service"
      });
    }

    const user = createUser(username.trim(), consentToToS);

    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.delete("/:id", (req, res) => {
  const success = deleteUser(req.params.id);

  if (!success) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    message: "User deleted and consent withdrawn"
  });
});

userRouter.get("/", (req, res) => {
  res.json(getUsers());
});

export default userRouter;

