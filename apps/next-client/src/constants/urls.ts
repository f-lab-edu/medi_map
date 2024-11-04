export const ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/login",
  },
  HOME: "/",
};

export const API_URLS = {
  LOGIN: `${process.env.LOCAL_BACKEND_URL}/api/auth/login`,
  SIGNUP: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/signup`,
  PHARMACY: "/api/pharmacy",
};