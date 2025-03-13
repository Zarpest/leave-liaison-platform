
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  UserCog, 
  ShieldAlert 
} from "lucide-react";

interface DesktopNavProps {
  userRole?: string;
  isSuperAdmin: boolean;
}

export function DesktopNav({ userRole, isSuperAdmin }: DesktopNavProps) {
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
      <Link
        to="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Inicio</span>
        </div>
      </Link>
      <Link
        to="/requests"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Solicitar Permiso</span>
        </div>
      </Link>
      <Link
        to="/history"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Historial</span>
        </div>
      </Link>
      <Link
        to="/team"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Equipo</span>
        </div>
      </Link>
      <Link
        to="/approvals"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>Aprobaciones</span>
        </div>
      </Link>
      {userRole === 'admin' && (
        <Link
          to="/admin"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Admin</span>
          </div>
        </Link>
      )}
      {isSuperAdmin && (
        <Link
          to="/superadmin"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>Super Admin</span>
          </div>
        </Link>
      )}
    </nav>
  );
}
