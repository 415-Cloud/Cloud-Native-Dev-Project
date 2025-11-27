import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import coachRoutes from "./routes/coach.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/coach", coachRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Coach Service running on port ${PORT}`);
});
