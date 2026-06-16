import React from "react";
import { LuX } from "react-icons/lu";

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md mx-4 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()} >
                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                    <h3 className="text-lg font-semibold text-slate-100">
                        {title}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                        <LuX size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};