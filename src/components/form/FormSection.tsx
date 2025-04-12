"use client";

import React from 'react';

interface FormSectionProps {
    children: React.ReactNode;
}

export default function FormSection({ children }: FormSectionProps) {
    return (
        <div className="rounded-lg bg-gray-50 p-4 shadow-sm space-y-4">
            {children}
        </div>
    );
} 