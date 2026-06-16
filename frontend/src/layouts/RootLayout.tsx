import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Image } from "lucide-react";

interface UserProfile {
    name?: string;
    email?: string;
}

export const RootLayout: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile | null>(null);

    useEffect(() => {
        try {
            const cachedUser = localStorage.getItem("user");
            if (cachedUser) {
                setUserData(JSON.parse(cachedUser));
            }
        } catch (error) {
            console.error("Failed to parse cached user payload:", error);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

            <header className="w-full h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 sm:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-sm tracking-wider uppercase text-slate-200">Media Hub</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        <User className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-medium text-slate-300">
                            {userData?.name || "test"}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <Outlet />
            </main>

            <footer className="w-full h-14 border-t border-slate-900 bg-slate-950 flex items-center justify-between px-6 sm:px-12 text-[11px] text-slate-600 tracking-wide mt-auto">
                <p>© {new Date().getFullYear()} FitTribe Storage Platform.</p>
                <div className="flex gap-4">
                    <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Ledger</span>
                    <span className="hover:text-slate-400 transition-colors cursor-pointer">CDN Endpoint Stats</span>
                </div>
            </footer>

        </div>
    );
};