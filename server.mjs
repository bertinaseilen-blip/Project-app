import express from "express";
import middlewareRoute from "./routes/middlewareRoute.mjs";

const PORT = 8080;
const app = express();

app.use(express.json());


// Mount task routes
app.use(middlewareRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

