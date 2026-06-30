export const imageValidation = (payload: { title: string; file: File }[]): string | null => {

    if (payload.length === 0) {
        return "Please upload image and title";
    }

    if (payload.length > 20) {
        return "Only 20 images can be uploaded at a time";
    }

    if (payload.some(image => !/[a-zA-Z0-9]/.test(image.title))) {
        return "Please assign a title for all images.";
    }

    return null;
};