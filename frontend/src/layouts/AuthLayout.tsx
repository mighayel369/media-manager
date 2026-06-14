import React from "react";
import { Outlet, Link } from "react-router-dom";
import { MdCastConnected } from "react-icons/md";

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 relative overflow-hidden">


            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none" />


            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
                <Link to="/" className="flex items-center gap-3 group">


                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                        <MdCastConnected size={22} className="text-white" />
                    </div>

                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Media<span className="text-purple-500">Hub</span>
                    </span>
                </Link>
            </header>

            <main className="w-full flex-1 flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                    <Outlet />
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 relative z-10">
                <p>&copy; {new Date().getFullYear()} MediaHub. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};