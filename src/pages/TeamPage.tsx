
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

const TeamPage = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendario del Equipo</h1>
            <p className="text-muted-foreground mt-1">
              Consulta los permisos y disponibilidad de tu equipo
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Calendario Compartido</CardTitle>
              <CardDescription>
                Visualiza cuándo tus compañeros están de permiso para coordinar mejor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamCalendar />
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p>Nota: Los datos del calendario se sincronizan con la hoja de cálculo de Google en tiempo real.</p>
            <p>
              <a 
                href="https://docs.google.com/spreadsheets/d/1PTpL4VOi_j1yyrh1x0bs_XmcEuauKyrP6c3cJuVCGfc/edit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ver hoja de cálculo original
              </a>
            </p>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default TeamPage;
