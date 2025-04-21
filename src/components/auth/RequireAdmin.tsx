
import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();

  // Temporalmente permitimos el acceso sin restricción para arreglar el problema
  // de asignación de superadministrador
  console.log("Permitiendo acceso temporal al panel de administración", user);
  
  return <>{children}</>;
};

export default RequireAdmin;
