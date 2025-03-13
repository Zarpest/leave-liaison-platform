
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { isSuperAdmin } from "@/services/adminService";
import { AppLogo } from "./AppLogo";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { UserDropdown } from "./UserDropdown";
import { AuthButtons } from "./AuthButtons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

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
          <AppLogo />
        </div>

        {user ? (
          <>
            {/* Desktop Navigation */}
            {!isMobile && (
              <DesktopNav 
                userRole={user.role} 
                isSuperAdmin={isSuperAdminUser} 
              />
            )}

            <div className="flex items-center gap-2">
              {/* User dropdown (desktop) */}
              {!isMobile && (
                <UserDropdown 
                  user={user} 
                  onLogout={handleLogout} 
                />
              )}

              {/* Mobile Navigation */}
              {isMobile && (
                <MobileNav 
                  user={user} 
                  isSuperAdmin={isSuperAdminUser} 
                  isOpen={isOpen} 
                  setIsOpen={setIsOpen} 
                  onLogout={handleLogout} 
                />
              )}
            </div>
          </>
        ) : (
          <AuthButtons />
        )}
      </div>
    </header>
  );
}
