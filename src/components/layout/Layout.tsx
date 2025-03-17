
import React from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className={cn("flex-grow px-4 sm:px-6 md:px-8 py-6 animate-fade-in", className)}>
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <footer className="py-6 px-4 sm:px-6 md:px-8 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Plataforma de Gestión de Permisos © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Soporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
