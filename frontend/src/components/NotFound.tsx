import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NotFoundProps {
    title?: string;
    description?: string;
    errorCode?: string | number;
}

export const NotFound: React.FC<NotFoundProps> = ({ title = "Resource Not Found",
    description = "The asset or page you are trying to access has been moved, removed, or doesn't exist in our registry system.",
    errorCode,
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-950/20 text-slate-100 min-h-[60vh] animate-fade-in">

            <div className="text-center max-w-md w-full p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-xl backdrop-blur-md space-y-6">


                <div className="space-y-2">
                    {errorCode && (
                        <h1 className="text-5xl font-extrabold tracking-tighter text-slate-400/50 mb-1">
                            {errorCode}
                        </h1>
                    )}
                    <h2 className="text-lg font-bold tracking-tight text-slate-200">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>


                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Go Back</span>
                    </button>
                </div>

            </div>

        </div>
    );
};