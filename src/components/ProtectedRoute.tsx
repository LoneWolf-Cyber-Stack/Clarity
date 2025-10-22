import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Loader2 } from 'lucide-react';
type ProtectedRouteProps = {
  children: React.ReactNode;
};
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkSession = useAuthStore((s) => s.checkSession);
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}