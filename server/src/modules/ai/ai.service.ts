import  { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../core/config/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const askAI = async (message: string) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(message);
    return result.response.text();
}

