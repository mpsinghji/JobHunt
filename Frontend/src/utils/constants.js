const phase = process.env.NODE_ENV === "development" ? "dev" : "prod";
const BASE_BACKEND_URL = phase === "dev" ? "http://localhost:3000" : "https://jobhunt-73ih.onrender.com"

export const USER_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/user`;
export const COMPANY_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/company`;
export const JOB_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT= `${BASE_BACKEND_URL}/api/v1/applications`;