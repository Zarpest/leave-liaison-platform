
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  Home, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  CheckSquare, 
  UserCog, 
  ShieldAlert, 
  LogOut 
} from "lucide-react";

interface MobileNavProps {
  user: {
    name?: string;
    email: string;
    role?: string;
  };
  isSuperAdmin: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => Promise<void>;
}

export function MobileNav({ user, isSuperAdmin, isOpen, setIsOpen, onLogout }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="mb-4">
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center gap-2 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback>
                {user.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-5 w-5" />
            <span>Mi Perfil</span>
          </Link>
          <Link
            to="/requests"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <Calendar className="h-5 w-5" />
            <span>Solicitar Permiso</span>
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <Clock className="h-5 w-5" />
            <span>Historial</span>
          </Link>
          <Link
            to="/team"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <Users className="h-5 w-5" />
            <span>Equipo</span>
          </Link>
          <Link
            to="/approvals"
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <CheckSquare className="h-5 w-5" />
            <span>Aprobaciones</span>
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <UserCog className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          )}
          {isSuperAdmin && (
            <Link
              to="/superadmin"
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Super Admin</span>
            </Link>
          )}
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-red-600 mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
