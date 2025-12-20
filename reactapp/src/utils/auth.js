
import {jwtDecode} from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // clear expired token
      return true;
    }
    return false;
  } catch (err) {
    localStorage.removeItem("token");
    return true;
  }
  
};
