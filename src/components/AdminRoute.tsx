import { ReactNode, ComponentType } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <a href="/" className="text-primary underline">
            Go back home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for route configuration
export function withAdminRoute<P extends object>(Component: ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminRoute>
        <Component {...props} />
      </AdminRoute>
    );
  };
}
