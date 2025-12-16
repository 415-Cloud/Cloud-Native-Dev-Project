import OpenAI from "openai";
import dotenv from "dotenv";

if (process.env.NODE_env !== "production") {
    dotenv.config();
}

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
    You are an AI fitness coach. Create a personalized 2-week workout plan based on the following user data:
    ${JSON.stringify(userData, null, 2)}

    Return the response in strictly valid JSON format with the following structure:
    {
        "advice": "A brief summary of advice and tips (2-3 sentences)",
        "trainingPlan": [
            {
                "week": 1,
                "days": [
                    {
                        "day": "Monday",
                        "activity": "Running/Strength/Yoga/Rest",
                        "duration": "e.g., 30 min",
                        "distance": "e.g., 5 km (optional)",
                        "exercises": "e.g., Full Body (optional)",
                        "intensity": "High/Moderate/Easy",
                        "notes": "Any specific instructions"
                    }
                    // ... include all 7 days
                ]
            }
            // ... include week 2
        ]
    }
    Ensure the JSON is valid and does not include any markdown formatting or code blocks.
    `;

    try {
        const completion = await getClient().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful fitness assistant that outputs only valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error(`Failed to generate advice: ${error.message}`);
    }
}
