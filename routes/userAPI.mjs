import express from "express";
import { createUser, deleteUser, getUsers, loginUser } from "../dataObjects/user.mjs";
import i18n from "../modules/i18n.mjs";
import { verifyToken } from "../modules/security.mjs"; // you already have generateToken


const userRouter = express.Router();
userRouter.use(express.json());


// Middleware to protect routes
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Malformed token" });

  try {
    const userId = verifyToken(token); // returns userId if valid
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
/* ------------------ LANGUAGE HELPER ------------------ */
function getLanguage(req) {

  let lang = req.headers["accept-language"];

  if (!lang) return i18n.en;

  lang = lang.substring(0, 2);

  if (i18n[lang]) {
    return i18n[lang];
  }

  return i18n.en;
}


/* ------------------ CREATE USER ------------------ */
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

    res.status(400).json({ error: err.message });

  }

});


/* ------------------ LOGIN USER ------------------ */
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


/* ------------------ DELETE USER ------------------ */
userRouter.delete("/:id", async (req, res) => {

  const t = getLanguage(req);

  try {

    const success = await deleteUser(req.params.id);

    if (!success) {
      return res.status(404).json({ error: t.userNotFound || "User not found" });
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