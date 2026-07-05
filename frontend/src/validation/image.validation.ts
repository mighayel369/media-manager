export const imageValidation = (payload: { title: string; file: File }[]): string | null => {
    const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE);
    if (payload.length === 0) {
        return "Please upload image and title";
    }

    if (payload.length > 20) {
        return "Only 20 images can be uploaded at a time";
    }

    if (payload.some(image => !/[a-zA-Z0-9]/.test(image.title))) {
        return "Please assign a title for all images.";
    }

    const oversizedImage = payload.find(
        image => image.file.size > MAX_FILE_SIZE
    );

    if (oversizedImage) {
        return `"${oversizedImage.file.name}" exceeds the maximum size of 5 MB.`;
    }

    return null;
};