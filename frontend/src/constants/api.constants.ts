
export const API_ROUTES = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/user/logout',
    },
    PHOTOS: {
        GET_ALL: '/photos',
        UPLOAD: '/photos/upload',
        UPDATE: (id: string) => `/photos/${id}`,
        DELETE: (id: string) => `/photos/${id}`,
    }
} as const