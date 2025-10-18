
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isSuperAdmin } from '@/services/roleService';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await isSuperAdmin();
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  // Mientras carga, no mostramos nada
  if (loading) {
    return null;
  }

  // Si el usuario es superadmin, muestra el contenido
  if (isAdmin) {
    return <>{children}</>;
  }

  // Si no es superadmin, no muestra nada
  return null;
};

export default RequireAdmin;
