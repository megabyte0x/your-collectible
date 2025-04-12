'use client';

import { useState } from 'react';

export default function ImageGeneratorPage() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    enhance: true // set to true if you want to use the enhanced prompt feature
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            setImageUrl(data.imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error generating image:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">AI Image Generator</h1>

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium">
                            Image Description
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to generate..."
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            rows={4}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate Image'}
                    </button>

                    {error && (
                        <div className="text-red-500 mt-2">{error}</div>
                    )}

                    {imageUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium">Generated Image:</h3>
                            <img
                                src={imageUrl}
                                alt="Generated"
                                className="mt-2 max-w-full h-auto rounded-md shadow-md"
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
} 