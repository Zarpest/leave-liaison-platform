import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserIcon, MailIcon, BuildingIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [loading, setLoading] = useState(false);

  // Departamentos disponibles
  const departments = [
    "Recursos Humanos",
    "Tecnología",
    "Finanzas",
    "Operaciones",
    "Marketing",
    "Ventas",
    "Legal",
    "Administración"
  ];

  const updateProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name,
          department
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente",
      });
      
      // Actualizar el contexto de autenticación para reflejar los cambios
      if (user) {
        user.name = name;
        user.department = department;
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
      console.error("Error al actualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
            <p className="text-muted-foreground mt-1">
              Configura tu información personal y preferencias
            </p>
          </div>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="personal">
                <UserIcon className="mr-2 h-4 w-4" />
                Información Personal
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Tu Perfil</CardTitle>
                    <CardDescription>
                      Información básica sobre tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback className="text-lg">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-medium">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {user?.department && (
                      <span className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                        {user.department}
                      </span>
                    )}
                    {user?.role && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold transition-colors">
                        {user.role}
                      </span>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Editar Información</CardTitle>
                    <CardDescription>
                      Actualiza los datos de tu perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="name">Nombre Completo</Label>
                        </div>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="email">Correo Electrónico</Label>
                        </div>
                        <Input 
                          id="email" 
                          value={user?.email} 
                          disabled 
                          placeholder="tu.correo@ejemplo.com"
                        />
                        <p className="text-xs text-muted-foreground">El correo electrónico no se puede modificar</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="department">Departamento</Label>
                        </div>
                        <Select 
                          value={department} 
                          onValueChange={setDepartment}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Selecciona tu departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={updateProfile} 
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ProfilePage;
