console.log("Hello via Bun!");
import express from "express";
import { generateEnhancedImage, generateImage } from "./openai.js";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Configure CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 204
}));

// Configure middleware to parse JSON
app.use(express.json());

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

// Define the image generation endpoint
app.post("/generate-image", (req, res) => {
    const { prompt, enhance = false } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    // Handle the image generation asynchronously
    (async () => {
        try {
            let imageUrl;

            if (enhance) {
                imageUrl = await generateEnhancedImage(prompt);
            } else {
                imageUrl = await generateImage(prompt);
            }

            res.json({ imageUrl });
        } catch (error) {
            console.error('Error generating image:', error);
            res.status(500).json({ error: 'Failed to generate image' });
        }
    })();
});
