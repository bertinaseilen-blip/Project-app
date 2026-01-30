import express from "express";
import middlewareRoute from "./routes/middlewareRoute.mjs";
import apiRoutes from "./routes/tasksAPI.mjs";
import usersAPI from "./routes/userAPI.mjs";

const app = express();
const PORT = 8080;


app.use(express.json());

app.use("/api", apiRoutes);
app.use("/user", usersAPI);

app.get("/", (req, res) => {
  res.send("Reminder API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





