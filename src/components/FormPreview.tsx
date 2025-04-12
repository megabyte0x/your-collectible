"use client";

import { useState, useEffect, useCallback } from "react";
import InputField from "./form/InputField";
import ColorPicker from "./form/ColorPicker";
import AccessoryItems from "./form/AccessoryItems";
import { Button } from "./ui/Button";
import Image from "next/image";
import { sdk, ComposeCast } from "@farcaster/frame-sdk";
export type FormData = {
    ethnicity: string;
    gender: string;
    hairStyle: string;
    backgroundColor: string;
    borderColor: string;
    accessoryPosition: string;
    top: string;
    pants: string;
    shoes: string;
    accessories: string;
    optionalDetails: string;
    accessoryItems: string[];
    productName: string;
    textColor: string;
};

export default function FormPreview() {
    const [formData, setFormData] = useState<FormData>({
        ethnicity: "Asian",
        gender: "Male",
        hairStyle: "Brown and Short",
        backgroundColor: "#ffffff",
        borderColor: "#000000",
        accessoryPosition: "right",
        top: "T-Shirt",
        pants: "Jeans",
        shoes: "Sneakers",
        accessories: "Watch",
        optionalDetails: "Glasses",
        accessoryItems: ["Laptop", "Headphones", "", ""],
        productName: "Megabyte",
        textColor: "#000000",
    });

    const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
    const [castHash, setCastHash] = useState<string | null>(null);

    // Define total number of steps (groups)
    const totalSteps = 6;

    const handleInputChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAccessoryItemChange = (index: number, value: string) => {
        const newAccessoryItems = [...formData.accessoryItems];
        newAccessoryItems[index] = value;
        setFormData((prev) => ({
            ...prev,
            accessoryItems: newAccessoryItems,
        }));
    };

    const generatePrompt = useCallback((data: FormData): string => {
        // Use template format and fill in with form values
        const accessoryItemsList = data.accessoryItems
            .filter(Boolean)
            .map(item => `• ${item}`)
            .join('\n');

        const template = `
A 3D collectible toy figure of a cartoon ${data.ethnicity ? `${data.ethnicity}, ` : ""} ${data.gender || ""} with ${data.hairStyle || ""}, styled in a modern, slightly exaggerated cartoon aesthetic. The figure is packaged in a clear plastic blister pack, mounted on a ${data.backgroundColor} cardboard backing with a ${data.borderColor} border.

The character is wearing:
	• Top/Shirt: ${data.top || ""}
	• Pants: ${data.pants || ""}
	• Shoes: ${data.shoes || ""}
	• Accessories: ${data.accessories || ""}
	• Optional Details: ${data.optionalDetails || ""}

To the ${data.accessoryPosition || "bottom"} of the figure, accessory items are neatly arranged in individual plastic compartments. These represent the character's personality, profession, or lifestyle. Include around 4–6 items.

Accessories:
${accessoryItemsList}

At the top of the packaging, the product name "${data.productName || ""}" is displayed in ${data.textColor} using a clean, modern sans-serif font like "Inter Bold."

The overall aesthetic should resemble premium toy packaging — stylish, minimal, and collectible, with an emphasis on character identity and lifestyle.
`;

        return template.trim();
    }, []);

    const handleNextStep = () => {
        if (currentStep === totalSteps - 2) {
            // Generate the prompt when going to the last step
            const prompt = generatePrompt(formData);

            setGeneratedPrompt(prompt);
            // Increment to the last step to show the prompt
            setCurrentStep(currentStep + 1);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(Math.max(0, currentStep - 1));
    };

    const copyToClipboard = (text: string) => {

        try {
            // Create a temporary textarea element to copy from
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            alert("Prompt copied to clipboard!");
        } catch (error) {
            console.error("Copy failed:", error);

            // Fallback to clipboard API
            try {
                if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            alert("Prompt copied to clipboard!");
                        })
                        .catch(err => {
                            console.error("Clipboard API failed:", err);
                            alert("Could not copy. Please select and copy the text manually.");
                        });
                }
            } catch (clipboardError) {
                console.error("Clipboard API error:", clipboardError);
                alert("Could not copy. Please select and copy the text manually.");
            }
        }
    };

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        setImageGenerationError(null);
        setShowConfirmModal(false);

        try {
            // Call the API endpoint instead of directly using OpenAI
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: generatedPrompt,
                    enhance: false // set to true if you want enhancement
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            setGeneratedImageUrl(data.imageUrl.toString());
        } catch (error) {
            console.error("Error generating image:", error);
            setImageGenerationError("Failed to generate image. Please try again.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleCast = async () => {
        try {
            const result: ComposeCast.Result<false> = await sdk.actions.composeCast({
                text: "Generated my collectible! using collectible.megabyte0x.xyz",
                embeds: [
                    `${generatedImageUrl}`
                ],
                close: false,
            });
            setCastHash(result.cast.hash);
        } catch (error) {
            console.error("Error posting cast:", error);
        }
    }

    useEffect(() => {
        console.log("Current step changed to:", currentStep);

        // If we're at the final step and don't have a prompt, generate one
        if (currentStep === totalSteps - 1 && !generatedPrompt) {
            const prompt = generatePrompt(formData);
            console.log("Generating missing prompt for final step:", prompt);
            setGeneratedPrompt(prompt);
        }
    }, [currentStep, generatedPrompt, formData, generatePrompt]);

    // Render the form section based on current step
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Character Basics</h2>
                        <InputField
                            label="Ethnicity/Skin Tone"
                            value={formData.ethnicity}
                            onChange={(value: string) => handleInputChange("ethnicity", value)}
                        />
                        <InputField
                            label="Gender/Character Type"
                            value={formData.gender}
                            onChange={(value: string) => handleInputChange("gender", value)}
                        />
                        <InputField
                            label="Hair Color and Hairstyle"
                            value={formData.hairStyle}
                            onChange={(value: string) => handleInputChange("hairStyle", value)}
                        />
                        <InputField
                            label="Optional Details"
                            value={formData.optionalDetails || ""}
                            onChange={(value: string) => handleInputChange("optionalDetails", value)}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Character Outfit</h2>
                        <InputField
                            label="Top/Shirt"
                            value={formData.top}
                            onChange={(value: string) => handleInputChange("top", value)}
                        />
                        <InputField
                            label="Bottom/Pants"
                            value={formData.pants}
                            onChange={(value: string) => handleInputChange("pants", value)}
                        />
                        <InputField
                            label="Shoes"
                            value={formData.shoes}
                            onChange={(value: string) => handleInputChange("shoes", value)}
                        />
                        <InputField
                            label="Accessories"
                            value={formData.accessories}
                            onChange={(value: string) => handleInputChange("accessories", value)}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Accessory Items</h2>
                        <AccessoryItems
                            items={formData.accessoryItems}
                            onChange={handleAccessoryItemChange}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Design Settings</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="accessory-position" className="text-sm font-normal text-gray-400">
                                    Accessory Position
                                </label>
                                <select
                                    id="accessory-position"
                                    className="w-full p-2 border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.accessoryPosition}
                                    onChange={(e) => handleInputChange("accessoryPosition", e.target.value)}
                                >
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                            <ColorPicker
                                label="Background Color"
                                value={formData.backgroundColor}
                                onChange={(value: string) => handleInputChange("backgroundColor", value)}
                            />
                            <ColorPicker
                                label="Border Color/Design"
                                value={formData.borderColor}
                                onChange={(value: string) => handleInputChange("borderColor", value)}
                            />
                            <ColorPicker
                                label="Text Color"
                                value={formData.textColor}
                                onChange={(value: string) => handleInputChange("textColor", value)}
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Product Name</h2>
                        <InputField
                            label="Product Name"
                            value={formData.productName}
                            onChange={(value: string) => handleInputChange("productName", value)}
                        />
                    </div>
                );
            case 5:
                // Show the generated image if available, otherwise show the prompt
                if (generatedImageUrl) {
                    return (
                        <div className="space-y-6">
                            <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Your Collectible</h2>
                            <div className="relative aspect-square overflow-hidden rounded-lg border shadow-sm">
                                {isGeneratingImage ? (
                                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
                                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                                    </div>
                                ) : null}
                                <Image
                                    src={generatedImageUrl}
                                    alt="Generated collectible"
                                    className="w-full h-full object-cover"
                                    width={1024}
                                    height={1024}
                                />
                            </div>
                            <Button
                                onClick={() => handleCast()}
                            >
                                Cast your collectible!
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsGeneratingImage(true);
                                    setImageGenerationError(null);
                                    handleGenerateImage();
                                }}
                                variant="ghost"
                                className="py-2"
                                disabled={isGeneratingImage}
                            >
                                {isGeneratingImage ? (
                                    <>
                                        Generating...
                                    </>
                                ) : "Generate Again"}
                            </Button>
                        </div>
                    );
                }

                if (isGeneratingImage && !generatedImageUrl) {
                    return (
                        <div className="space-y-6 text-center">
                            <h2 className="text-lg text-gray-800 font-semibold mb-4">Generating Your Collectible</h2>
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                            </div>
                            <p className="text-gray-600">Please wait while we create your unique collectible...</p>
                        </div>
                    );
                }

                if (imageGenerationError) {
                    return (
                        <div className="space-y-6">
                            <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Error</h2>
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                                {imageGenerationError}
                            </div>
                            <Button
                                onClick={handleGenerateImage}
                                className="w-full py-2"
                            >
                                Try Again
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <h2 className="text-lg text-gray-800 font-semibold text-center mb-4">Complete Prompt</h2>
                        <div className="text-sm whitespace-pre-wrap text-gray-700 border border-gray-200 p-3 rounded bg-white min-h-[200px]">
                            {generatedPrompt || <span className="text-red-500 italic">Empty prompt - please go back and try again</span>}
                        </div>
                        <Button
                            onClick={() => {
                                setShowConfirmModal(true);
                            }}
                            className="w-full py-2"
                            disabled={isGeneratingImage}
                        >
                            {isGeneratingImage ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                                    Generating...
                                </>
                            ) : "Generate Collectible"}
                        </Button>
                        <Button
                            onClick={() => {
                                // Get the prompt from the displayed text if state value isn't working
                                let textToCopy = generatedPrompt;
                                if (!textToCopy) {
                                    textToCopy = generatePrompt(formData);
                                    console.log("Generated text for copy:", textToCopy);
                                }

                                copyToClipboard(textToCopy);
                            }}
                            variant="ghost"
                            className="w-full py-2 mt-2"
                        >
                            Copy Prompt
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    // Render the confirmation modal
    const renderConfirmModal = () => {
        if (!showConfirmModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Would you like to check once before generating?</h3>
                    <div className="flex flex-col space-y-3">
                        <Button onClick={handleGenerateImage}>
                            No, I am good!
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Yes, Let me have a look once more
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto p-4 min-h-screen">
            <div className="bg-white p-6 pb-8 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create your Collectible</h1>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6">
                    {['character', 'outfit', 'accessories', 'design', 'product', 'prompt'].map((step, i) => (
                        <div
                            key={step}
                            className={`h-2 w-6 rounded-full ${i < currentStep ? 'bg-blue-500' :
                                i === currentStep ? 'bg-blue-700' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {renderStepContent()}

                {currentStep < totalSteps - 1 && (
                    <div className="flex justify-between mt-8">
                        {currentStep > 0 && (
                            <Button
                                onClick={handlePrevStep}
                                variant="ghost"
                                className="w-1/2 mr-2"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNextStep}
                            className={`${currentStep === 0 ? "w-full" : "w-1/2 ml-2"}`}
                        >
                            Next
                        </Button>
                    </div>
                )}

                {currentStep === totalSteps - 1 && !generatedImageUrl && !isGeneratingImage && !imageGenerationError && !showConfirmModal && (
                    <Button
                        onClick={handlePrevStep}
                        variant="ghost"
                        className="w-full mt-4"
                    >
                        Back
                    </Button>
                )}
            </div>

            {renderConfirmModal()}
        </div>
    );
} 