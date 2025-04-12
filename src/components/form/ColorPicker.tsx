"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export default function ColorPicker({
    label,
    value,
    onChange
}: ColorPickerProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="text-sm font-normal text-gray-400">
                {label}
            </Label>
            <div className="flex items-center gap-2">
                <Input
                    id={label.toLowerCase().replace(/\s+/g, '-')}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 p-0 border-0 rounded-md cursor-pointer"
                    style={{ appearance: 'none' }}
                />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 p-2 border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
            </div>
        </div>
    );
} 