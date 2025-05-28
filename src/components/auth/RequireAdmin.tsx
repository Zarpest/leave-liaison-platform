
import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();

  // Lista de usuarios permitidos como superadministradores
  const allowedSuperAdmins = [
    'turedseguraprotejeres@gmail.com',
    'joexdsonrie@gmail.com'
  ];

  // Verifica si el usuario está logueado y si su email está en la lista permitida
  const isAllowedUser = user && allowedSuperAdmins.includes(user.email);

  // Si el usuario es uno de los permitidos, muestra el contenido (children)
  if (isAllowedUser) {
    return <>{children}</>;
  }

  // Si no es un usuario permitido (o no está logueado), no muestra nada
  return null;
};

export default RequireAdmin;
