// auth.mjs
import { verifyToken } from "./security.mjs";

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);
  if (!authHeader) return res.status(401).json({ error: "No authorization header" });

  const parts = authHeader.split(" ");
 
  if (parts.length !== 2) return res.status(401).json({ error: "Invalid authorization format" });
  

  const token = parts[1];
  console.log("TOKEN:", token);
  
  const userId = verifyToken(token);
  console.log("USER ID FROM TOKEN:", userId);

  if (!userId) return res.status(401).json({ error: "Invalid token" });

  req.userId = userId;
  next();
}