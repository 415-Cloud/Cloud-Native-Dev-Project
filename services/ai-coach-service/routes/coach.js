import { Router } from "express";
import { generateAdvice } from "../services/llm.js";

const router = Router();

router.post("/advice", async (req, res) => {
    try {
        const advice = await generateAdvice(req.body);
        res.json({ advice });
    } catch (err) {
        console.error("AI Coach Error:", err);
        res.status(500).json({ error: "Failed to generate AI coaching advice" });
    }

});

export default router;
