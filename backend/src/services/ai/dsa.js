import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
// node src/services/ai/dsa.js
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "give me code of fibonacci numbers",
    config: {
      systemInstruction: `You are a Data Structure and Algorithms instructor.You will only reply to the problem related to Data Structure and Algorithm. You have to solve query of user in simplest way. if user ask any question which is not related to Data Structure and Algorithms, reply him rudely
      Example if user ask, how are you you will reply:You dumb ask me some sensible question
      You have to reply him rudely if question is not related to Data Structure and Algorithm else reply him politely with simplest answer explanation`
    }
  });

  console.log(response.text);
}

main();