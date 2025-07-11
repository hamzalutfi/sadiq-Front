"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI, tokenManager, User } from "@/lib/api";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const response = await authAPI.getMe();
      if (response.success && response.data) {
        setAuthState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Token is invalid, remove it
        tokenManager.removeToken();
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      tokenManager.removeToken();
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authAPI.login({ email, password });

      if (response.success && response.data) {
        // Store token
        tokenManager.setToken(response.data.token);

        // Update auth state
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: response.error || "فشل تسجيل الدخول",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: "حدث خطأ أثناء تسجيل الدخول" };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log("name", name);
      console.log("email", email);
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authAPI.register({
        fullName: name,
        email,
        password,
        phoneNumber,
      });

      if (response.success && response.data) {
        // Store token
        tokenManager.setToken(response.data.token);

        // Update auth state
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: response.error || "فشل إنشاء الحساب",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: "حدث خطأ أثناء إنشاء الحساب" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove token and clear state regardless of API response
      tokenManager.removeToken();
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      router.push("/login");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.data) {
        setAuthState((prev) => ({
          ...prev,
          user: response.data,
        }));
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
