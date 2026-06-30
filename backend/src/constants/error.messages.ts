export const ERROR_MESSAGES = {

    UNAUTHORIZED: "Unauthorized user",
    INVALID_CREDENTIALS: "Invalid email or password",
    TOKEN_INVALID: "Token verification failed",


    IMAGE_FILE_REQUIRED: "No image file uploaded.",
    IMAGE_NOT_FOUND: "Target gallery image not found.",
    IMAGE_ID_REQUIRED: "Image ID parameter is required for deletion.",
    IMAGE_ALREADY_DELETED: "Image not found or already deleted.",
    IMAGE_REORDER_DATA_REQUIRED: "No reorder dataset provided.",

    INTERNAL_SERVER_ERROR: "Internal server error",
    VALIDATION_ERROR: "Validation failed",
    RESOURCE_NOT_FOUND: "Resource not found",

    CLOUDINARY_UPLOAD_FAILED: "Failed to upload image.",
    CLOUDINARY_EMPTY_RESPONSE: "Cloud storage provider returned an empty response.",

    VALIDATION_FAILED: "Validation failed",
    INVALID_FILE_FORMAT: "Invalid file format. Only images are allowed!",

    IMAGE_REQUIRED: "Please upload at least one image.",
    INVALID_IMAGE_DATA: "Each uploaded image must have a corresponding title."
} as const;