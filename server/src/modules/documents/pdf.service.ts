
import fs from "fs";
import pdf from "pdf-parse";

export const parsePdf = async (filePath: string): Promise<string> => {
    try {
        // Read uploaded PDF file
        const buffer = fs.readFileSync(filePath);

        // Extract text
        const data = await pdf(buffer);

        return data.text;
    } catch (error) {
        throw new Error("Failed to parse PDF");
    }
};