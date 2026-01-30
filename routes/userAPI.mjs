import express from "express";
import { generateID } from "../dataObjects/user.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

const Users = {};

userRouter.post("/", (req, res) => {
  const { username, consentToToS } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (consentToToS !== true) {
    return res.status(400).json({ error: "Consent to Terms of Service is required" });
  }

  const id = generateID();
  const newUser = {
    id,
    username,
    consentToToS,
  };

  Users[id] = newUser;

  res.status(201).json(newUser);
});

userRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!Users[id]) {
    return res.status(404).json({ error: "User not found" });
  }

  delete Users[id];
  res.json({ message: "User deleted and consent revoked" });
});

userRouter.get("/", (req, res) => {
  res.json(Object.values(Users));
});

export default userRouter;
