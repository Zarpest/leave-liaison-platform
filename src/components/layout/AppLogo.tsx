
import React from "react";
import { Link } from "react-router-dom";

export function AppLogo() {
  return (
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
  );
}
