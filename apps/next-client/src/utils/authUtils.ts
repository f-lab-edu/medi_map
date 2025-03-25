import { ALERT_MESSAGES } from "@/constants/alertMessage";
import Cookies from "js-cookie";

export const getAuthHeader = () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error(ALERT_MESSAGES.ERROR.NO_TOKEN);
  }
  return { Authorization: `Bearer ${token}` };
};