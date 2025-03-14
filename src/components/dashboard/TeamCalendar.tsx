
import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock, BarChart } from "lucide-react";
import { SlideIn } from "@/components/animations/Transitions";
import CalendarViewSelector from "./calendar/CalendarViewSelector";
import CalendarView from "./calendar/CalendarView";
import ListView from "./calendar/ListView";
import UpcomingLeavesSummary from "./calendar/UpcomingLeavesSummary";
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
    filteredTeamData,
    loading,
    currentMonth,
    setCurrentMonth,
    typeFilter,
    setTypeFilter,
    departmentFilter,
    setDepartmentFilter,
    availableTypes,
    availableDepartments,
    upcomingLeaves,
    hasActiveFilters
  } = useTeamCalendar();

  return (
    <SlideIn direction="left" delay={0.2}>
      <Card className="card-hover mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Disponibilidad del Equipo</CardTitle>
                <CardDescription>Ver el calendario de permisos del equipo</CardDescription>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <CalendarViewSelector 
                view={view} 
                onViewChange={(newView) => setView(newView)}
                typeFilter={typeFilter}
                departmentFilter={departmentFilter}
                onTypeFilterChange={setTypeFilter}
                onDepartmentFilterChange={setDepartmentFilter}
                availableTypes={availableTypes}
                availableDepartments={availableDepartments}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Cargando datos...</div>
          ) : (
            view === "calendar" ? (
              <CalendarView
                teamData={filteredTeamData}
                date={date}
                setDate={setDate}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                typeFilter={typeFilter}
                departmentFilter={departmentFilter}
              />
            ) : (
              <ListView 
                teamData={filteredTeamData}
                date={date}
              />
            )
          )}
        </CardContent>
      </Card>
      
      {/* Summary Card for Upcoming Leave Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl">Próximas Ausencias</CardTitle>
              <CardDescription>Resumen de los próximos 30 días</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UpcomingLeavesSummary events={teamData} daysToShow={30} />
        </CardContent>
      </Card>
    </SlideIn>
  );
};

// Memoize the entire TeamCalendar component
export default memo(TeamCalendar);
