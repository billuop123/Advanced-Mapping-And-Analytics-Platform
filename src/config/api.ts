const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    SHAPES: {
        GET_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/shapes/getShapebyId/${id}`,
        BATCH_CREATE: `${API_BASE_URL}/api/v1/shapes/batchCreateShapes`,
        DELETE_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/shapes/deleteshapebyid/${id}`,
        DELETE_ALL: `${API_BASE_URL}/api/v1/shapes/deleteAllShapes`,
        FETCH_ALL: `${API_BASE_URL}/api/v1/shapes/fetchshapes`,
        DELETE_SHAPE: `${API_BASE_URL}/api/v1/shapes/deleteShape`
    },
    USER: {
        EDITING: (id: string) => `${API_BASE_URL}/api/v1/user/editing/${id}`,
        SINGLE_STATS: `${API_BASE_URL}/api/v1/users/singleStats`,
        IS_VERIFIED: `${API_BASE_URL}/api/v1/isVerified`,
        ALL_USERS: `${API_BASE_URL}/api/v1/user/allusers`,
        DELETE_USER: `${API_BASE_URL}/api/v1/user/userDelete`,
        UPDATE_ROLE: (userId: string) => `${API_BASE_URL}/api/v1/user/userUpdateRole/${userId}`,
        ROLE: `${API_BASE_URL}/api/v1/user/role`
    },
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
        REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
        VERIFY_EMAIL: `${API_BASE_URL}/api/v1/auth/verifyEmail`,
        SEND_VERIFICATION_EMAIL: `${API_BASE_URL}/api/v1/auth/sendVerificationEmail`
    },
    RECTANGLES: {
        GET_ALL: `${API_BASE_URL}/api/v1/rectangles/getRectangle`,
        CREATE: `${API_BASE_URL}/api/v1/rectangles/createRectangle`,
        DELETE_SINGLE: `${API_BASE_URL}/api/v1/rectangles/deleteSingleRectangle`
    },
    LINES: {
        GET_ALL: `${API_BASE_URL}/api/v1/line/getLine`,
        CREATE: `${API_BASE_URL}/api/v1/line/createLine`,
        DELETE_SINGLE: `${API_BASE_URL}/api/v1/line/deleteSingleLine`
    },
    CIRCLES: {
        GET_ALL: `${API_BASE_URL}/api/v1/circle/getCircle`,
        CREATE: `${API_BASE_URL}/api/v1/circle/createCircle`,
        DELETE_SINGLE: `${API_BASE_URL}/api/v1/circle/deleteSingleCircle`
    },
    POLYGONS: {
        GET_ALL: `${API_BASE_URL}/api/v1/polygons/getPolygon`,
        CREATE: `${API_BASE_URL}/api/v1/polygons/createPolygon`,
        DELETE_SINGLE: `${API_BASE_URL}/api/v1/polygons/deleteSinglePolygon`
    },
    MARKERS: {
        CREATE: `${API_BASE_URL}/api/v1/marker/createMarker`,
        DELETE: `${API_BASE_URL}/api/v1/marker/deleteMarker`
    },
    SVG: {
        GET: `${API_BASE_URL}/api/v1/getSvg`
    }
}; 