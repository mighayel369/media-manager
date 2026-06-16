
export const API_ROUTES = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login'
    },
    PHOTOS: {
        GET_ALL: '/image',
        UPLOAD: '/image',
        UPDATE: (imageId: string) => `/image/${imageId}`,
        DELETE: (imageId: string) => `/image/${imageId}`,
        REORDER:'/image/reorder'
    }
} as const