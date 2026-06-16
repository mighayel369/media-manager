import axiosInstance from "../../../config/axios.config"
import { API_ROUTES } from "../../../constants/api.constants"
const { PHOTOS } = API_ROUTES

export const PhotoService = {
    getAllImages: async () => {
        const response = await axiosInstance.get(PHOTOS.GET_ALL);
        console.log(response)
        return response.data;
    },

    uploadImage: async (payload: FormData) => {
        const response = await axiosInstance.post(PHOTOS.UPLOAD, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    updateImage: async (ImageId: string, formData: FormData) => {
        const response = await axiosInstance.put(PHOTOS.UPDATE(ImageId), formData, {
            headers: {
                'Content-Type': "multipart/form-data"
            }
        })
        return response.data
    },

    reorderImages: async (reorderedItems: { imageId: string; position: number; }[]) => {
        const response = await axiosInstance.patch(PHOTOS.REORDER, { reorderedItems });
        return response.data;
    },

    deletImage:async(imageId:string)=>{
        const response=await axiosInstance.delete(PHOTOS.DELETE(imageId))
        return response.data
    }
}