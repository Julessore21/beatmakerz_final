"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (typeof window === "undefined") return false;
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username] && users[username] === password) {
      localStorage.setItem("currentUser", username);
      setUser(username);
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string) => {
    if (typeof window === "undefined") return false;
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[username]) {
      return false;
    }
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
    setUser(username);
    return true;
  };

  const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("currentUser");
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

