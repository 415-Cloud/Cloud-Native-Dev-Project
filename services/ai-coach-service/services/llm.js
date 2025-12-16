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
    // Sanitize input: remove frontend-generated prompts that might confuse the model
    const { prompt: ignoredPrompt, requestType, ...cleanData } = userData;

    const prompt = `
    You are an AI fitness coach. Create a personalized 2-week workout plan based on the following user data:
    ${JSON.stringify(cleanData, null, 2)}

    Return the response in strictly valid JSON format. Do not include markdown formatting (like \`\`\`json).
    
    The output must strictly follow this structure:
    {
        "advice": "A brief summary of advice and tips (2-3 sentences). DO NOT include the weekly schedule here.",
        "trainingPlan": [
            {
                "week": 1,
                "days": [
                    {
                        "day": "Monday",
                        "activity": "Running",
                        "duration": "30 min", 
                        "distance": "5 km", 
                        "intensity": "Moderate",
                        "notes": "Keep a steady pace"
                    }
                    // ... continue for all days
                ]
            }
        ]
    }

    IMPORTANT: 
    - The "advice" field must ONLY contain general advice. 
    - The detailed daily schedule MUST be in the "trainingPlan" array.
    
    Field Rules:
    - "day": Must be full day name (Monday, Tuesday, etc.)
    - "activity": Main activity name (Running, Strength Training, Yoga, HIIT, Rest Day, etc.)
    - "duration": String with unit (e.g., "30 min", "45 min", "-"). Use "-" for Rest Days.
    - "distance": String with unit (e.g., "5 km"). Optional, include only if relevant.
    - "exercises": String describing focus (e.g., "Upper Body"). Optional, include only for Strength.
    - "intensity": One of "Easy", "Moderate", "High". Optional for Rest Days.
    - "notes": Short string for extra hints. Optional.
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
        console.log("Raw AI Response:", content); // Debug log

        // Clean up markdown code blocks if they exist (just in case)
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(cleanContent);
        console.log("Parsed Plan:", JSON.stringify(parsed, null, 2)); // Debug log
        return parsed;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error(`Failed to generate advice: ${error.message}`);
    }
}
