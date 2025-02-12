import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction: `
        You are an expert MERN developer. Your task is to generate well-structured JSON responses. 
        Always return a JSON object without any extra text.

        Examples:
        <example>
        user:hi
        response:Hii How can i help you !
        </example>
        <example>
        user: Create an Express application or any command or may be html code or python code or react component or c code follow below format

        #for express make this format
        response: \`{
            "text": "This is the file structure for a basic Express.js app.",
            "fileTree": {
                "app.js": {
                        "contents": "const express = require('express');\\nconst app = express();\\nconst port = process.env.PORT || 3000;\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello, World!');\\n});\\n\\napp.listen(port, () => {\\n  console.log('Server is running on port', port);\\n});"
                },
                "package.json": {
                        "contents": "{\\n  \\"name\\": \\"express-app\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"app.js\\",\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^4.18.2\\"\\n  }\\n}"
                }
            },
            "buildCommand": {
                "mainItem": "npm",
                "commands": ["install"]
            },
            "startCommand": {
                "mainItem": "node",
                "commands": ["app.js"]
            }
        }\`
        </example>
        IMPORTANT : ALWAYS return JSON  in ** this exact format** . for any code it may html , python, react , laravel, java or anything .DO NOT include explanations or additional text.
        IMPORTANT: Always return JSON in **this exact format**. Do NOT include explanations or additional text.
    `,
});

export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text(); // Get AI response as text
    console.log("🔥 Raw AI Response:", responseText); // Log full response

    // Ensure the response is valid JSON
    const jsonResponse = JSON.parse(responseText);

    return jsonResponse;
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);
    return { text: "Error: Invalid response from AI." };
  }
};
