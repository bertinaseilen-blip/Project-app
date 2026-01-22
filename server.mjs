import express from "express";
import middlewareRoute from "./routes/middlewareRoute.mjs";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(middlewareRoute);

app.get("/test", async (req, res) => {
    await fetch("http://localhost:8080/task", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskName: "Task 1",
            completed: true
        })
    });

    res.send("Test triggered");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

