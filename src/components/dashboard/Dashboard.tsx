
import React from "react";
import LeaveBalanceCard from "./LeaveBalanceCard";
import RequestForm from "./RequestForm";
import LeaveHistory from "./LeaveHistory";
import TeamCalendar from "./TeamCalendar";
import { StaggerChildren } from "@/components/animations/Transitions";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tus permisos y consulta la disponibilidad del equipo
        </p>
      </div>

      <StaggerChildren>
        <div className="grid gap-6 md:grid-cols-3">
          <LeaveBalanceCard
            title="Vacaciones"
            total={20}
            used={8}
            description="Los días de vacaciones anuales se reinician el 1 de enero"
          />
          <LeaveBalanceCard
            title="Permiso por Enfermedad"
            total={12}
            used={2}
            description="Balance de permisos por enfermedad para el año actual"
          />
          <LeaveBalanceCard
            title="Tiempo Personal"
            total={24}
            used={10}
            description="Horas disponibles para tiempo personal"
          />
        </div>

        {/* Cambiado el orden: ahora RequestForm está antes que TeamCalendar */}
        <RequestForm />
        
        <TeamCalendar />

        <LeaveHistory />
      </StaggerChildren>
    </div>
  );
};

export default Dashboard;
