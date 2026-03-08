import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import reminderAPI from "./routes/reminderAPI.mjs"; ;
import usersAPI from "./routes/userAPI.mjs";
import { initDB } from "./modules/storageProviders/storageProviderSQL.mjs";

const app = express();
const PORT = process.env.PORT || 8080;

await initDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/reminders", reminderAPI);
app.use("/user", usersAPI);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});