"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  register as registerApi,
  login as loginApi,
  logoutApi,
} from "../services/auth.api";
import type { User, UserRole } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  registerUser: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  loginUser: (email: string, password: string, role: UserRole) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getRedirectPath = (role?: string) => {
    switch (role) {
      case "admin":
        return "/welcome";
      case "agent":
        return "/properties/property";
      case "user":
        return "/properties/property";
      default:
        return "/";
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(false);

      try {
        const token = localStorage.getItem("token");
        if (token) {
          setUser({
            id: "dummy",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            password: "",
            role: "admin",
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("token");
      }
    };

    checkAuthStatus();
  }, []);

  const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const validRoles = ["user", "agent", "admin"];
    const userRole = validRoles.includes(role) ? role : "user";

    const res = await registerApi(
      firstName,
      lastName,
      email,
      password,
      userRole
    );

    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    if (res.user) {
      setUser(res.user);
      console.log("res.user", res.user);
      if (res.user.role) {
        router.replace(getRedirectPath(res.user.role));
      } else {
        router.replace(getRedirectPath());
      }
    } else {
      router.replace(getRedirectPath());
    }
  };

  const loginUser = async (email: string, password: string, role: UserRole) => {
    const validRoles = ["user", "agent", "admin"];
    const userRole = validRoles.includes(role) ? role : "user";

    const res = await loginApi(email, password, userRole);

    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    if (res.user) {
      setUser(res.user);
      if (res.user.role) {
        router.replace(getRedirectPath(res.user.role));
      } else {
        router.replace(getRedirectPath());
      }
    } else {
      router.replace(getRedirectPath());
    }
  };

  const logoutUser = async () => {
    await logoutApi();
    setUser(null);
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
