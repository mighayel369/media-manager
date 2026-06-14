import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    isLoading,
    variant = "primary",
    className = "",
    disabled,
    ...props
}) => {
    const baseStyles = "w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/10 hover:from-purple-500 hover:to-blue-500",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/10",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};