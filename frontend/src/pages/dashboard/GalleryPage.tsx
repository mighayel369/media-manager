import React, { useState, useEffect, useRef } from "react";
import { LuPlus } from "react-icons/lu";
import { PhotoCard } from "../../features/photos/components/PhotoCard";
import { AddImage } from "../../features/photos/components/AddImage";
import { PhotoService } from "../../features/photos/services/photo.service";
import { Modal } from "../../components/Modal";
import { DndContext, closestCenter, type DragEndEvent, } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove, } from "@dnd-kit/sortable";



interface ImageData {
    imageId: string;
    title: string;
    imageUrl: string;
    position: number;
}




export const GalleryPage: React.FC = () => {
    const [addImageModal, setAddImageModal] = useState(false);
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
    const [page, setPage] = useState(1);

    const [loadingMore, setLoadingMore] = useState(false);

    const [hasMore, setHasMore] = useState(true);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const fetchImages = async (
        pageNumber: number,
        append = false
    ) => {
        try {
            const res = await PhotoService.getAllImages(
                pageNumber,
                8
            );

            if (append) {
                setImages(prev => [
                    ...prev,
                    ...res.data
                ]);
            } else {
                setImages(res.data);
            }

            setHasMore(res.hasMore);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);

        fetchImages(1).finally(() =>
            setLoading(false)
        );
    }, []);
    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const first = entries[0];

                if (
                    first.isIntersecting &&
                    hasMore &&
                    !loadingMore
                ) {
                    setLoadingMore(true);

                    const nextPage = page + 1;

                    await fetchImages(nextPage, true);

                    setPage(nextPage);

                    setLoadingMore(false);
                }
            }
        );

        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [images]);

    const uploadNewImage = async (
        images: { title: string; file: File }[]
    ) => {
        try {
            const formData = new FormData();

            images.forEach((image) => {
                formData.append("titles", image.title);
                formData.append("imageFiles", image.file);
            });

            const res = await PhotoService.uploadImages(formData);

            if (res.success) {
                setPage(1);
                fetchImages(1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = async (
        imageId: string,
        newTitle?: string,
        newFile?: File | null
    ) => {
        try {
            const formData = new FormData();

            if (newTitle) {
                formData.append("title", newTitle);
            }

            if (newFile) {
                formData.append("imageFile", newFile);
            }

            const res = await PhotoService.updateImage(
                imageId,
                formData
            );

            if (res.success && res.data) {
                setImages((prev) =>
                    prev.map((img) =>
                        img.imageId === imageId
                            ? res.data
                            : img
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = async (imageId: string) => {
        try {
            const response = await PhotoService.deletImage(imageId);

            if (response.success) {
                setImages(prev =>
                    prev.filter(img => img.imageId !== imageId)
                );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setModalOpen(false);
            setSelectedImage(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const previousImages = [...images];
        const oldIndex = images.findIndex((img) => img.imageId === active.id);
        const newIndex = images.findIndex((img) => img.imageId === over.id);

        const reorderedImages = arrayMove(
            images,
            oldIndex,
            newIndex
        );

        const updatedImages = reorderedImages.map(
            (img, index) => ({
                ...img,
                position: index
            })
        );

        setImages(updatedImages);
        const start = Math.min(oldIndex, newIndex);
        const end = Math.max(oldIndex, newIndex);

        const changedImages = updatedImages.slice(start, end + 1).map((img) => ({ imageId: img.imageId, position: img.position }));

        try {
            await PhotoService.reorderImages(changedImages);
        } catch (error) {
            console.error("Failed to persist image order", error);
            setImages(previousImages);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-100">
                        Media Hub Collection
                    </h2>

                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage item gallery displays across your frontend channels
                    </p>
                </div>

                <button
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                    onClick={() => setAddImageModal(true)}
                >
                    <LuPlus className="h-4 w-4 stroke-[3]" />
                    <span>Upload New Image</span>
                </button>
            </div>

            {loading ? (
                <div className="py-32 flex items-center justify-center">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />

                        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    </div>
                </div>
            ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <p className="text-sm text-slate-500">
                        No media found
                    </p>
                </div>
            ) : (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={images.map(
                            (img) => img.imageId
                        )}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {images.map((img) => (
                                <PhotoCard
                                    key={img.imageId}
                                    imageId={img.imageId}
                                    title={img.title}
                                    imageUrl={img.imageUrl}
                                    onEdit={handleEditClick}
                                    onDelete={() => {
                                        setSelectedImage(img)
                                        setModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                        <div ref={bottomRef} className="h-20 flex justify-center items-center">
                            {loadingMore && (
                                <div className="relative w-8 h-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <AddImage
                isOpen={addImageModal}
                onClose={() => setAddImageModal(false)}
                onUploadSuccess={uploadNewImage}
            />

            <Modal
                isOpen={modalOpen}
                title={`Delete ${selectedImage?.title} image`}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedImage(null);
                }}
            >
                <p className="text-slate-300 mb-4">
                    Are you sure you want to delete this image?
                </p>

                <div className="flex justify-end gap-2">
                    <button onClick={() => {
                        setModalOpen(false);
                        setSelectedImage(null);
                    }}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-white" >
                        Cancel
                    </button>

                    <button onClick={() => {
                        if (selectedImage) {
                            handleDeleteClick(selectedImage.imageId)
                        }
                    }}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white">
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};