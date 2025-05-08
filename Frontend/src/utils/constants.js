const phase = import.meta.env.VITE_NODE_ENV === "development" ? "dev" : "prod";
export const BASE_BACKEND_URL = phase === "dev" ? import.meta.env.VITE_BACKEND_LOCAL_URL : import.meta.env.VITE_BACKEND_WEB_URL;

export const USER_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/user`;
export const COMPANY_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/company`;
export const JOB_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT= `${BASE_BACKEND_URL}/api/v1/applications`;