import React, { useId } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
    const generatedId = useId();
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <div className="w-full text-left relative">
            <label
                htmlFor={generatedId}
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
            >
                {label}
            </label>

            <input
                {...props}
                id={generatedId}
                type={props.type === "password" ? showPassword ? "text" : "password" : props.type}
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 transition-all ${error
                    ? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-800 focus:border-purple-500 focus:ring-purple-500"
                    } ${className}`}
            />

            {props.type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-200"
                >
                    {showPassword ? (
                        <FaEye className="w-4 h-4" />
                    ) : (
                        <FaEyeSlash className="w-4 h-4" />
                    )}
                </button>
            )}
        </div>
    );
};