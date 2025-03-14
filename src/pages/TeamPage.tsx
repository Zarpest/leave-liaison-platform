
import React from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import TeamCalendar from "@/components/dashboard/TeamCalendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CalendarClock, Users, Filter } from "lucide-react";

const TeamPage = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calendario del Equipo</h1>
              <p className="text-muted-foreground mt-1">
                Consulta los permisos y disponibilidad de tu equipo
              </p>
            </div>
          </div>
          
          <Card className="border bg-muted/30 border-primary/10">
            <CardContent className="p-4 flex gap-2 items-center">
              <Users className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Este calendario muestra la disponibilidad de todos los miembros del equipo. 
                Utiliza los filtros para ver permisos por tipo o departamento.
              </p>
            </CardContent>
          </Card>
          
          <div className="py-4">
            <TeamCalendar />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
              <CalendarClock className="h-4 w-4" />
              <p>Nota: El calendario muestra únicamente las solicitudes aprobadas.</p>
            </div>
            
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
              <Filter className="h-4 w-4" />
              <p>Usa los filtros para mostrar permisos específicos por tipo o departamento.</p>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default TeamPage;
