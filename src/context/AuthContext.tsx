"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  getCurrentUser,
} from "@/lib/services/auth-service";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedUser = await getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const success = await loginService(username, password);
    if (success) {
      const refreshedUser = await getCurrentUser();
      setUser(refreshedUser);
    }
    return success;
  };

  const signup = async (username: string, password: string) => {
    const success = await signupService(username, password);
    if (success) {
      const refreshedUser = await getCurrentUser();
      setUser(refreshedUser);
    }
    return success;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
