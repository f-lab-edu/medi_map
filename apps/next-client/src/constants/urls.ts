export const ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/login",
  },
  HOME: "/",
};

export const API_URLS = {
  LOGIN: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/login`,
  SIGNUP: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/signup`,
  PHARMACY: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/pharmacy`,
  MEDICINE: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/medicine`,
  MEDICINE_SEARCH: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/medicine/search`,
};