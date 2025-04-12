import OpenAI from 'openai';

// Initialize the OpenAI client with a function to ensure it's only created on the server side
const getOpenAIClient = () => {
    // Check if we're on the server side
    if (typeof window === 'undefined') {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }

        return new OpenAI({
            apiKey,
        });
    }

    throw new Error('OpenAI client can only be initialized on the server side');
};

/**
 * Generates an image using OpenAI's DALL-E model based on the provided prompt
 * 
 * @param prompt - The text description of the image to generate
 * @param size - The size of the image (default: 1024x1024)
 * @param model - The model to use (default: dall-e-3)
 * @param quality - Image quality (default: standard)
 * @returns The URL of the generated image
 */
export async function generateImage(
    prompt,
    size = '1024x1024',
    model = 'dall-e-3',
    quality = 'hd'
) {
    try {
        const openai = getOpenAIClient();
        const response = await openai.images.generate({
            model,
            prompt,
            n: 1,
            size,
            quality,
            response_format: 'b64_json',

        });

        console.log("response", response);

        return response.data[0].b64_json;
    } catch (error) {
        console.error('Error generating image with OpenAI:', error);
        throw new Error('Failed to generate image');
    }
}

/**
 * Generates a completion using GPT-4o model
 * 
 * @param prompt - The prompt to send to the model
 * @param maxTokens - Maximum number of tokens to generate
 * @returns The generated text
 */
export async function generateCompletion(
    prompt
) {
    try {
        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }]
        });

        return response.choices[0]?.message.content || '';
    } catch (error) {
        console.error('Error generating completion with OpenAI:', error);
        throw new Error('Failed to generate completion');
    }
}

/**
 * Generates a text-to-image using GPT-4o vision model and DALL-E
 * This is a two-step process:
 * 1. Send the prompt to GPT-4o to refine and enhance it
 * 2. Use the enhanced prompt to generate an image with DALL-E
 * 
 * @param userPrompt - User's original image description
 * @returns The URL of the generated image and the enhanced prompt
 */
export async function generateEnhancedImage(
    userPrompt
) {
    try {
        // Step 1: Enhance the prompt with GPT-4o
        //     const promptEnhancementInstruction = `Create a detailed, vivid image description based on this idea: "${userPrompt}". 
        // Make it detailed enough for an AI image generator to create a high-quality image. Don't change the original prompt, just enhance it.`;

        const enhancedPrompt = await generateCompletion(userPrompt);
        console.log("Enhanced prompt:", enhancedPrompt);
        // Step 2: Generate image with the enhanced prompt
        const imageUrl = await generateImage(enhancedPrompt);

        return imageUrl;
    } catch (error) {
        console.error('Error in enhanced image generation:', error);
        throw new Error('Failed to generate enhanced image');
    }
} 