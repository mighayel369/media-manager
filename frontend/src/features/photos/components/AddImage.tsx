import React, { useState, useRef } from "react";
import { LuX, LuCloudUpload } from "react-icons/lu";
import { imageValidation } from "../../../validation/image.validation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
interface AddImageProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: (data: { title: string, file: File }[]) => Promise<void>;
}

export const AddImage: React.FC<AddImageProps> = ({ isOpen, onClose, onUploadSuccess }) => {
    const [images, setImages] = useState<{
        title: string;
        file: File;
        preview: string;
    }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentImage = images[currentIndex];
    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const files = e.target.files

            setErrorMessage(null);
            const newImages = Array.from(files).map(file => ({
                title: "",
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(newImages);
            setCurrentIndex(0);
        }
    };

    const handleCancelButton = (e: React.MouseEvent) => {
        e.preventDefault()

        setImages([])
        setErrorMessage(null)
        onClose()
    }


    const handleSubmit = async () => {
        setErrorMessage(null);

        const validationError = imageValidation(images);

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            await onUploadSuccess(images);

            setImages([]);
            onClose();
        } catch (error: unknown) {
            const serverMessage = typeof error === "object" && error !== null && "message" in error
                ? String(error.message) :
                "Uploading failed ! try after some time";
            setErrorMessage(serverMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] animate-fade-in">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden p-6 shadow-2xl relative">

                <button
                    onClick={handleCancelButton}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <LuX className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold text-slate-100 mb-4">Upload Gallery Image</h3>

                <div className="space-y-5">

                    <div className="space-y-1.5">
                        <label htmlFor="title" className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                            Asset Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={currentImage?.title || ""}
                            onChange={(e) => {
                                setImages(prev => {
                                    const updated = [...prev];

                                    updated[currentIndex] = {
                                        ...updated[currentIndex],
                                        title: e.target.value
                                    };

                                    return updated;
                                });
                            }}
                            placeholder="Add Title"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                            Image Document File
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${currentImage
                                ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400"
                                : "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400 hover:text-slate-300"
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />

                            {currentImage ? (
                                <img
                                    src={currentImage.preview}
                                    className="w-full h-60 object-cover rounded-lg"
                                    alt=""
                                />
                            ) : (
                                <>
                                    <LuCloudUpload className="h-8 w-8 mx-auto mb-2" />
                                    <p>Select Images</p>
                                </>
                            )}
                            {images.length > 0 && (
                                <div className="text-center text-sm text-slate-400">
                                    Image {currentIndex + 1} of {images.length}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or AVIF format (Max 5MB)</p>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    {images.length > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                disabled={currentIndex === 0}
                                onClick={() =>
                                    setCurrentIndex(prev => prev - 1)
                                }>
                                <FaArrowLeft />
                            </button>
                            <button
                                disabled={currentIndex === images.length - 1}
                                onClick={() =>
                                    setCurrentIndex(prev => prev + 1)
                                }
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleCancelButton}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-600 disabled:opacity-50 transition-colors cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center min-w-[80px]"
                        >
                            {isSubmitting ? "Uploading..." : "Upload Asset"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};