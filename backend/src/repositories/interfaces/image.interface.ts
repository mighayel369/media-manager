export interface ImageDTO {
    imageId: string;
    title: string;
    imageUrl: string;
    position: number;
}

export interface CreateImagePayload {
    title: string;
    imageUrl: string;
}

export interface UpdateImagePayload {
    title?: string;
    imageUrl?: string;
    position?: number;
}

export interface PaginatedImages {
    images: ImageDTO[];
    total: number;
}

export interface ReorderImagePayload {
    imageId: string;
    position: number;
}