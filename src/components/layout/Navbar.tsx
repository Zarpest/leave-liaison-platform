
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MenuIcon,
  User2Icon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  XIcon,
  FileTextIcon,
  UsersIcon
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setIsOpen(false);

  // Creamos una URL directa a la imagen para asegurarnos de que se cargue correctamente
  const logoUrl = "/lovable-uploads/educo-logo.png";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    navigate("/admin"); // Redirige al panel de administración
  };

  const handleProfileClick = () => {
    // Por ahora, redirigimos al dashboard, pero en el futuro podría ser a una página de perfil
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <img 
              src={logoUrl}
              alt="Educo" 
              className="h-8" 
            />
            <span className="text-lg font-semibold hidden md:inline">Plataforma de Permisos</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="flex items-center gap-6 mx-6">
            <Link to="/" className="text-sm font-medium hover:text-primary btn-transition">
              Panel Principal
            </Link>
            <Link to="/requests" className="text-sm font-medium hover:text-primary btn-transition">
              Mis Solicitudes
            </Link>
            <Link to="/team" className="text-sm font-medium hover:text-primary btn-transition">
              Calendario de Equipo
            </Link>
            <Link to="/approvals" className="text-sm font-medium hover:text-primary btn-transition">
              Aprobaciones
            </Link>
            {user?.role === 'super_admin' && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary btn-transition">
                Administración
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSettingsClick}>
            <SettingsIcon className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "UN"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "usuario@educo.org"}</p>
                  {user?.department && (
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  )}
                  {user?.role && (
                    <p className="text-xs text-muted-foreground font-semibold">Rol: {user.role}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <HomeIcon className="mr-2 h-4 w-4" />
                <span>Panel Principal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/requests")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Mis Solicitudes</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/team")}>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Calendario de Equipo</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfileClick}>
                <User2Icon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              {user?.role === 'super_admin' && (
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Administración</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {isOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition" onClick={closeMobileMenu}>
                    <HomeIcon className="h-5 w-5" />
                    Panel Principal
                  </Link>
                  <Link to="/requests" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition" onClick={closeMobileMenu}>
                    <CalendarIcon className="h-5 w-5" />
                    Mis Solicitudes
                  </Link>
                  <Link to="/team" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition" onClick={closeMobileMenu}>
                    <UsersIcon className="h-5 w-5" />
                    Calendario de Equipo
                  </Link>
                  <Link to="/approvals" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition" onClick={closeMobileMenu}>
                    <FileTextIcon className="h-5 w-5" />
                    Aprobaciones
                  </Link>
                  {user?.role === 'super_admin' && (
                    <Link to="/admin" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition" onClick={closeMobileMenu}>
                      <SettingsIcon className="h-5 w-5" />
                      Administración
                    </Link>
                  )}
                  <div className="border-t my-2"></div>
                  <button 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary btn-transition text-left" 
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                  >
                    <LogOutIcon className="h-5 w-5" />
                    Cerrar sesión
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
