const phase = import.meta.env.NODE_ENV === "development" ? "dev" : "prod";
const BASE_BACKEND_URL = phase === "dev" ? `${import.meta.env.LOCALHOST_URL}` : `${import.meta.env.BACKEND_WEB_URL}`;

export const USER_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/user`;
export const COMPANY_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/company`;
export const JOB_API_END_POINT = `${BASE_BACKEND_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT= `${BASE_BACKEND_URL}/api/v1/applications`;