import { verifyToken } from "./security.mjs";

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ error: "invalidAuthFormat" });

  const parts = authHeader.split(" ");
 
  if (parts.length !== 2) return res.status(401).json({ error: "invalidAuthFormat" });
  

  const token = parts[1];
  
  const userId = verifyToken(token);

  if (!userId) return res.status(401).json({ error: "Invalid token" });

  req.userId = userId;
  next();
}