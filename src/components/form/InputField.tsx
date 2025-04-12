"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function InputField({
    label,
    value,
    onChange,
    placeholder = ""
}: InputFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="text-sm font-normal text-gray-400">
                {label}
            </Label>
            <Input
                id={label.toLowerCase().replace(/\s+/g, '-')}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-2 border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${value ? 'text-black' : 'text-gray-500'}`}
            />
        </div>
    );
} 