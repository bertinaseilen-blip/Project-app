import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import middlewareRoute from "./routes/middlewareRoute.mjs";
import apiRoutes from "./routes/tasksAPI.mjs";
import usersAPI from "./routes/userAPI.mjs";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


app.use("/api", apiRoutes);
app.use("/user", usersAPI);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





