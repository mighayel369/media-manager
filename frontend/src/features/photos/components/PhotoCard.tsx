import React, { useRef, useState, useEffect } from "react";
import { LuPencil, LuTrash2, LuCheck, LuX, LuUpload } from 'react-icons/lu';
import { useSortable, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface PhotoCardProps {
    imageId: string
    title: string;
    imageUrl: string;
    onEdit?: (key: string, newTitle?: string, newFile?: File | null) => Promise<void> | void;
    onDelete?: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ imageId, title, imageUrl, onEdit, onDelete }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: imageId, disabled: isEditing })

    const style = { transform: CSS.Transform.toString(transform), transition }

    useEffect(() => {
        setUpdatedTitle(title);
    }, [title]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUpdatedTitle(title);
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSave = async () => {
        if (!updatedTitle.trim() && !selectedFile) return;

        try {
            setIsSaving(true);
            if (onEdit) {
                await onEdit(imageId, updatedTitle, selectedFile);
            }
            setIsEditing(false);
            setSelectedFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Card sync save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg flex flex-col justify-between">

                <div className="w-full aspect-[4/3] bg-slate-950 overflow-hidden relative"  {...attributes} {...listeners}>
                    <img
                        src={previewUrl || imageUrl}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isEditing ? '' : 'group-hover:scale-105'}`}
                        loading="lazy"

                    />
                    <div className={`absolute inset-0 bg-slate-950/40 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />

                    {isEditing && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 cursor-pointer hover:text-emerald-400 transition-colors"
                        >
                            <LuUpload className="h-6 w-6 mb-1 filter drop-shadow" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
                                Change Image
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 flex items-center justify-between gap-3 bg-slate-900 border-t border-slate-800/50">

                    {isEditing ? (
                        <input
                            type="text"
                            ref={inputRef}
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            disabled={isSaving}
                            className="text-sm font-medium text-slate-100 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none px-2 py-1 rounded-md flex-1 min-w-0"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-200 truncate flex-1" title={title}>
                            {title}
                        </span>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !updatedTitle.trim()}
                                    className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer disabled:opacity-40"
                                    title="Save structural changes"
                                >
                                    <LuCheck className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Cancel and reverse changes"
                                >
                                    <LuX className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Edit details"
                                >
                                    <LuPencil className="h-4 w-4" />
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                        title="Delete asset"
                                    >
                                        <LuTrash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};