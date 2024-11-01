export const ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/login",
  },
  HOME: "/",
};

export const API_URLS = {
  LOGIN: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/login`,
  // SIGNUP: "http://localhost:5000/api/auth/signup",
  SIGNUP: `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/signup`,
};