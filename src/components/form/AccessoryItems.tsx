"use client";

import { useState, useId } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/Button";

interface AccessoryItem {
    id: string;
    value: string;
}

interface AccessoryItemsProps {
    items: string[];
    onChange: (index: number, value: string) => void;
}

export default function AccessoryItems({ items, onChange }: AccessoryItemsProps) {
    // Generate unique IDs for each item
    const baseId = useId();
    const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>(
        items.map((value, i) => ({ id: `${baseId}-item-${i}`, value }))
    );

    const [numItems, setNumItems] = useState(items.length);

    const handleAddItem = () => {
        if (numItems < 6) {
            setNumItems(numItems + 1);
            // Add new item with unique ID
            const newItem = { id: `${baseId}-item-${numItems}`, value: "" };
            setAccessoryItems([...accessoryItems, newItem]);
            // Notify parent component about the new item
            onChange(numItems, "");
        }
    };

    const handleChange = (id: string, value: string) => {
        // Find the index of the item
        const index = accessoryItems.findIndex(item => item.id === id);
        if (index !== -1) {
            // Update local state
            setAccessoryItems(prev =>
                prev.map(item => item.id === id ? { ...item, value } : item)
            );
            // Notify parent component
            onChange(index, value);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-sm font-normal text-gray-400">Accessory Items (4-6)</Label>
                <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={numItems >= 6}
                    className="text-sm py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Add Item
                </Button>
            </div>

            <div className="space-y-3">
                {accessoryItems.slice(0, numItems).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-6 text-gray-400">{index + 1}.</span>
                        <Input
                            value={item.value}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                            className={`flex-1 p-2 border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${item.value ? 'text-black' : 'text-gray-500'}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
} 