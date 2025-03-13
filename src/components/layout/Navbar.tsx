
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Calendar, 
  ClipboardList, 
  LogOut, 
  Menu, 
  User, 
  Clock,
  Home,
  CheckSquare,
  Users,
  UserCog,
  ShieldAlert
} from "lucide-react";
import { isSuperAdmin } from "@/services/adminService";
import { useEffect, useState as useReactState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useReactState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const isAdmin = await isSuperAdmin();
          setIsSuperAdminUser(isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/educo-logo.png" 
              alt="Educo" 
              className="h-8"
            />
            <span className="text-lg font-semibold hidden sm:inline-block">
              Educo
            </span>
          </Link>
        </div>

        {user ? (
          <>
            {/* Versión de escritorio */}
            {!isMobile && (
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
                {user.role === 'admin' && (
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
                {isSuperAdminUser && (
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
            )}

            <div className="flex items-center gap-2">
              {/* Menú de usuario (escritorio) */}
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback>
                          {user.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/requests" className="cursor-pointer flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Solicitar Permiso</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/history" className="cursor-pointer flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" />
                          <span>Historial</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Menú móvil */}
              {isMobile && (
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
                      {isSuperAdminUser && (
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
                          handleLogout();
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
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
