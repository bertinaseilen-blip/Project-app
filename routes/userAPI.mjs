import express from "express";
import { createUser, deleteUser, getUsers } from "../dataObjects/user.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", (req, res) => {
  try {
    const { username, consentToToS } = req.body;
    const user = createUser(username, consentToToS);
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
  res.json({ message: "User deleted and consent revoked" });
});

userRouter.get("/", (req, res) => {
  res.json(getUsers());
});

export default userRouter;

