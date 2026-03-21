import express from "express";
import { createUser, deleteUser, getUsers, loginUser, getUserById  } from "../dataObjects/user.mjs";
import i18n from "../modules/i18n.mjs";
import { verifyToken } from "../modules/security.mjs"; 
import { changePassword } from "../dataObjects/user.mjs";


const userRouter = express.Router();
userRouter.use(express.json());


// Middleware to protect routes
export function authenticateToken(req, res, next) {
  const t = getLanguage(req);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: t.noToken });

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: t.malformedToken });
  }

const token = parts[1];

  try {
    const userId = verifyToken(token); 
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ error: t.invalidToken });
  }
}

function getLanguage(req) {

  let lang = req.headers["accept-language"];

  if (!lang) return i18n.en;

  lang = lang.substring(0, 2);

  if (i18n[lang]) {
    return i18n[lang];
  }

  return i18n.en;
}
//=====================================
//USER
//=====================================

userRouter.post("/", async (req, res) => {

  const t = getLanguage(req);

  try {

    const { username, password, consentToToS } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: t.userRequired });
    }

    const user = await createUser(username, password, consentToToS);

    res.status(201).json({
      message: t.userCreated,
      user
    });

  } catch (err) {

    if (err.message.includes("exists")) {
      return res.status(400).json({ error: t.userExists });
    }

    res.status(400).json({ error: t[err.message] || err.message });

  }

});

//======================================
//LOGIN
//=======================================

userRouter.post("/login", async (req, res) => {

  const t = getLanguage(req);

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: t.userRequired });
    }

    const result = await loginUser(username, password);

    res.json({
      ...result,
      message: t.loginSuccess
    });

  } catch (err) {

    res.status(401).json({
      error: t.loginError
    });

  }

});

userRouter.get("/me", authenticateToken, async (req, res) => {

  const t = getLanguage(req);

  try {

  const user = await getUserById(req.userId);

    if (!user) {
      return res.status(404).json({ error: t.userNotFound });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({ error: t.errorProfile });

  }

});

userRouter.delete("/:id", authenticateToken, async (req, res) => {

  const t = getLanguage(req);

  try {
    
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: t.notAllowed });
}
    const success = await deleteUser(req.params.id);

    if (!success) {
      return res.status(404).json({ error: t.userNotFound });
    }

    res.json({
      message: t.accountDeleted
    });

  } catch (err) {

    res.status(500).json({ error: t.serverError || err.message });

  }

});

userRouter.put("/password", authenticateToken, async (req, res) => {

  const t = getLanguage(req);

  try {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: t.userRequired });
    }

    await changePassword(req.userId, oldPassword, newPassword);

    res.json({ message: "Password updated" });

  } catch (err) {

    res.status(400).json({
      error: t[err.message] || err.message
    });

  }

});

userRouter.get("/", async (req, res) => {

  const t = getLanguage(req);

  try {

    const users = await getUsers();

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: t.errorUsers
    });

  }

});


export default userRouter;