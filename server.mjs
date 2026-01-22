import express from "express";
import taskRoutes from "./routes/taskRoutes.mjs";

const PORT = 8080;
const app = express();

app.use(express.json());


// Mount task routes
app.use(taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

