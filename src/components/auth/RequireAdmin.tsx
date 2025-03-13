
import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isSuperAdmin } from '@/services/adminService';

interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const isSuperAdminUser = await isSuperAdmin();
        setIsAdmin(isSuperAdminUser);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
