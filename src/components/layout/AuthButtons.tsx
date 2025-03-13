
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button variant="outline">Iniciar Sesión</Button>
      </Link>
      <Link to="/register">
        <Button>Registrarse</Button>
      </Link>
    </div>
  );
}
