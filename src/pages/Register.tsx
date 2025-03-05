
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/Transitions";
import { UserIcon, KeyIcon, UserPlusIcon, BuildingIcon, MailIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(name, email, department, password);
      // La redirección se maneja en el efecto useEffect
    } catch (error) {
      // El manejo de errores ya se realiza en el contexto de autenticación
      console.error("Error en el formulario de registro:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <FadeIn className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img src="/lovable-uploads/educo-logo.png" alt="Educo" className="h-12" />
            </div>
            <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para registrarte en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="department"
                    type="text"
                    placeholder="Recursos Humanos"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>Creando cuenta...</>
                ) : (
                  <>
                    <UserPlusIcon className="mr-2 h-4 w-4" /> Registrarse
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </FadeIn>
    </div>
  );
};

export default Register;
