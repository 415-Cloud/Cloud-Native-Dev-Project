import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
let client;

function getClient() {
    if (!apiKey) {
        throw new Error("Missing OpenAI API key. Set OPEN_AI_KEY or OPENAI_API_KEY in your environment.");
    }

    if (!client) {
        client = new OpenAI({ apiKey });
    }

    return client;
}

export async function generateAdvice(userData) {
    const prompt = `
    You are an AI fitness coach. Provide 2-3 pieces of personalized and safe
    advice based on the following user data:
    ${JSON.stringify(userData, null, 2)}
    `;

    const completion = await getClient().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: prompt}
        ]
    });

    return completion.choices[0].message.content;
}
