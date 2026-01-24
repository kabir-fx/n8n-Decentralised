import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "n8n_auth_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const isAuthenticated = !!token;

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const getAuthHeader = useCallback(() => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
  };
}

// Hook for use in components that need to redirect on auth state
export function useAuthWithRedirect() {
  const auth = useAuth();
  const navigate = useNavigate();

  const logoutAndRedirect = useCallback(() => {
    auth.logout();
    navigate("/signin");
  }, [auth, navigate]);

  const loginAndRedirect = useCallback(
    (newToken: string, redirectTo: string = "/canvas") => {
      auth.login(newToken);
      navigate(redirectTo);
    },
    [auth, navigate]
  );

  return {
    ...auth,
    logoutAndRedirect,
    loginAndRedirect,
  };
}
