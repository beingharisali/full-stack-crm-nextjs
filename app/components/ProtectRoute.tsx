"use client";

import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, loading, refreshProfile } = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !loading) {
        try {
          await refreshProfile();
        } catch (error) {
          console.error("Failed to refresh profile:", error);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [user, loading, refreshProfile]);

  useEffect(() => {
    if (!isChecking && !loading) {
      if (!user) {
        router.replace("/");
      } else if (!allowedRoles.includes(user.role)) {
        router.replace("/unauthorized");
      }
    }
  }, [user, loading, router, allowedRoles, isChecking]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}