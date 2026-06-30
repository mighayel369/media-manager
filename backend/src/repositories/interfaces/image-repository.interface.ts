import { ReorderImagePayload, CreateImagePayload, PaginatedImages, UpdateImagePayload, ImageDTO } from "./image.interface.js";
export interface IImageRepository {
    addImages(userId: string, images: CreateImagePayload[]): Promise<ImageDTO[]>;
    getAllImages(userId: string, currentPage: number, limit: number): Promise<PaginatedImages>;
    updateImage(imageId: string, updateData: UpdateImagePayload): Promise<ImageDTO | null>;
    deleteImage(imageId: string): Promise<boolean>;
    updatePositions(userId: string, reorderedItems: ReorderImagePayload[]): Promise<void>;
}