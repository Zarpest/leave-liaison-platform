
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { SlideIn } from "@/components/animations/Transitions";
import CalendarViewSelector from "./calendar/CalendarViewSelector";
import CalendarView from "./calendar/CalendarView";
import ListView from "./calendar/ListView";
import useTeamCalendar from "@/hooks/useTeamCalendar";

// Custom CSS to ensure calendar day numbers don't overflow
import "./TeamCalendar.css";

const TeamCalendar = () => {
  const {
    date,
    setDate,
    view,
    setView,
    teamData,
    loading,
    currentMonth,
    setCurrentMonth
  } = useTeamCalendar();

  return (
    <SlideIn direction="left" delay={0.2}>
      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Disponibilidad del Equipo</CardTitle>
                <CardDescription>Ver el calendario de permisos del equipo</CardDescription>
              </div>
            </div>
            <CalendarViewSelector 
              view={view} 
              onViewChange={(newView) => setView(newView)} 
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Cargando datos...</div>
          ) : (
            view === "calendar" ? (
              <CalendarView
                teamData={teamData}
                date={date}
                setDate={setDate}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
              />
            ) : (
              <ListView 
                teamData={teamData}
                date={date}
              />
            )
          )}
        </CardContent>
      </Card>
    </SlideIn>
  );
};

export default TeamCalendar;
