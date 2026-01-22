import express from "express";

const PORT = 8080;
const app = new express();

app.use(express.static("public"));
app.use(express.json()); // Needed to read JSON body

// --- Middleware ---
function taskCompletionMiddleware(req, res, next) {
    const { taskName, completed } = req.body;

    if (completed === true) {
        console.log(`${taskName} completed`);
    }

    next();
}
app.get("/test-middleware", async (req, res) => {
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

    res.send("Middleware test triggered");
});

// --- Routes ---

// Simulates checking a checkbox
app.put("/task", taskCompletionMiddleware, (req, res) => {
    res.send("Task updated");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
