import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateImage, generateEnhancedImage } from '../../../lib/openai';

export async function POST(request: NextRequest) {
    try {
        const { prompt, enhance = false } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        let imageUrl: string;

        if (enhance) {
            imageUrl = await generateEnhancedImage(prompt);
        } else {
            imageUrl = await generateImage(prompt);
        }

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error in generate-image API route:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'POST method required with prompt in request body' },
        { status: 405 }
    );
} 