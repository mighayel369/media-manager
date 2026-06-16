export interface IUploadImage {
    uploadImage(file: Express.Multer.File): Promise<string>;
}