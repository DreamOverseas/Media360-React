import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Load Backend Host for API calls
const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * 拉取当前用户信息（方法A：populate 需要的关系）
   * - avatar
   * - coupon
   * - influencer_profile
   */
  const fetchMe = useCallback(async () => {
    const token = Cookies.get("token");
    console.log("[Auth] fetchMe: token exists =", !!token);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BACKEND_HOST}/api/users/me`, {
        params: {
          "populate[avatar]": "*",
          "populate[influencer_profile][populate]": "*",
          "populate[seller_profile][populate]": "*"
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (DEBUG) console.log("[Auth] /users/me data =", response.data);
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(
        "[Auth] fetchMe error:",
        err?.response?.data || err.message
      );
      setError(
        err?.response?.data?.error?.message ||
          err.message ||
          "Failed to fetch current user."
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 初始化：进入应用时尝试获取用户
   */
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  /**
   * 登录：成功后写 cookie，再调用 fetchMe 获取带 populate 的用户对象
   */
  const login = useCallback(
    async (email, password) => {
      try {
        console.log("[Auth] login with:", email);
        const response = await axios.post(
          `${BACKEND_HOST}/api/auth/local`,
          { identifier: email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        if (DEBUG) console.log("[Auth] login response:", response.data);
        const jwt = response?.data?.jwt;
        if (!jwt) throw new Error("No JWT returned from /auth/local");

        Cookies.set("token", jwt, { expires: 7, sameSite: "Lax" });
        await fetchMe();
        return true;
      } catch (error) {
        console.error(
          "[Auth] login error:",
          error?.response?.data || error.message
        );
        setError(
          error?.response?.data?.error?.message ||
            error.message ||
            "Login failed."
        );
        setUser(null);
        // 关键：登录失败时抛出异常
        throw new Error(
          error?.response?.data?.error?.message ||
            error.message ||
            "Login failed."
        );
      }
    },
    [fetchMe]
  );

  /**
   * 登出：清除 token & 用户状态
   */
  const logout = useCallback(() => {
    if (DEBUG) console.log("[Auth] logout user:", user);
    Cookies.remove("token");
    setUser(null);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      error,
      login,
      logout,
      refetchMe: fetchMe,
    }),
    [user, loading, error, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
