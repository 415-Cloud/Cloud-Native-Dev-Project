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

    Return the response in strictly valid JSON format. Do not include markdown formatting (like \`\`\`json).
    
    The output must strictly follow this structure:
    {
        "advice": "A brief summary of advice and tips (2-3 sentences)",
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
                    },
                    {
                        "day": "Tuesday",
                        "activity": "Strength Training",
                        "duration": "45 min",
                        "exercises": "Full Body",
                        "intensity": "High"
                    }
                    // ... continue for Wednesday through Sunday
                ]
            },
            {
                "week": 2,
                // ... full week 2 schedule
            }
        ]
    }

    Field Rules:
    - "day": Must be full day name (Monday, Tuesday, etc.)
    - "activity": Main activity name (Running, Strength Training, Yoga, HIIT, Rest Day, etc.)
    - "duration": String with unit (e.g., "30 min", "45 min", "-"). Use "-" for Rest Days.
    - "distance": String with unit (e.g., "5 km"). Optional, include only if relevant (e.g. for Running/Cycling).
    - "exercises": String describing focus (e.g., "Upper Body", "Legs"). Optional, include only for Strength attributes.
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
        return JSON.parse(content);
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error(`Failed to generate advice: ${error.message}`);
    }
}
