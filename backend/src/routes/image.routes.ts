import express from 'express';
import { ImageController } from '../controllers/image.controller.js';
import { ImageService } from '../services/implementation.ts/image.service.js';
import { ImageRepository } from '../repositories/implementations/image.repository.impl.js';
import { CloudinaryUploadImageService } from '../infrastructure/storage/implementation/cloudinary-image.service.js';

import { uploadImage } from '../middleware/upload.middleware.js';
import { validateRequest } from '../middleware/validate.request.middleware.js';
import { imageSchema } from '../validators/image/image.param.validate.js';
import { addImageSchema } from '../validators/image/add.image.validate.js';
import { updateImageSchema } from '../validators/image/update.image.validate.js';
import { reorderImageSchema } from '../validators/image/reorder.image.validate.js';


const router = express.Router();


const imageRepository = new ImageRepository();
const imageUploadService = new CloudinaryUploadImageService();
const imageService = new ImageService(imageRepository, imageUploadService);

const imageController = new ImageController(imageService);


router.get('/', imageController.getAllImages);
router.post('/', uploadImage.single('imageFile'), validateRequest(addImageSchema), imageController.createImageGallary);
router.put('/:imageId', uploadImage.single('imageFile'), validateRequest(updateImageSchema), imageController.updateImageGallery);
router.patch('/reorder', validateRequest(reorderImageSchema), imageController.reorderImages);
router.delete('/:imageId', validateRequest(imageSchema), imageController.deleteImage);

export default router;