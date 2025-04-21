import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext'; // Asegúrate que la ruta a tu contexto sea correcta

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();

  // Verifica si el usuario está logueado y si su email es el permitido
  const isAllowedUser = user && user.email === 'turedseguraprotejeres@gmail.com';

  // Opcional: puedes mantener un log para depuración
  // console.log("Usuario actual:", user?.email, "¿Tiene acceso?", isAllowedUser);

  // Si el usuario es el permitido, muestra el contenido (children)
  if (isAllowedUser) {
    return <>{children}</>;
  }

  // Si no es el usuario permitido (o no está logueado), no muestra nada.
  // Alternativamente, podrías mostrar un mensaje o redirigir a otra página.
  return null;
  // Ejemplo alternativo: return <p>No tienes permiso para ver esta sección.</p>;
};

export default RequireAdmin;
