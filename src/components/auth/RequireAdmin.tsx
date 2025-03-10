
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSuperAdmin } from "@/services/adminService";

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = React.useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (user) {
          const superAdmin = await isSuperAdmin();
          setIsAdmin(superAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al verificar estado de administrador:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      checkAdminStatus();
    }
  }, [loading, user]);

  // Si está cargando o verificando el estado de administrador, mostrar un indicador de carga
  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redireccionar al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no es administrador, redireccionar al dashboard
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, mostrar el contenido
  return <>{children}</>;
};

export default RequireAdmin;
