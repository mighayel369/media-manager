import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = "",
    ...props
}) => {
    const generatedId = useId();

    return (
        <div className="w-full text-left">
            <label
                htmlFor={generatedId}
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
            >
                {label}
            </label>

            <input
                id={generatedId}
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 transition-all ${error
                    ? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-800 focus:border-purple-500 focus:ring-purple-500"
                    } ${className}`}
                {...props}
            />

            {error && (
                <span className="block text-xs font-medium text-red-400 mt-1.5 animate-fade-in">
                    {error}
                </span>
            )}
        </div>
    );
};