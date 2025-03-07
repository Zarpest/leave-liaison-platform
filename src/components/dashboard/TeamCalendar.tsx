
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay, isSameMonth, isWithinInterval, parseISO } from "date-fns";
import { SlideIn } from "@/components/animations/Transitions";
import { getAllTeamRequests } from "@/services/supabaseService";

// Custom CSS to ensure calendar day numbers don't overflow
import "./TeamCalendar.css";

const TeamCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [teamData, setTeamData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const teamRequests = await getAllTeamRequests();
        
        // Parse date strings to Date objects to make comparisons easier
        const formattedRequests = teamRequests.map(request => ({
          ...request,
          startDate: parseISO(request.start_date),
          endDate: parseISO(request.end_date)
        }));
        
        setTeamData(formattedRequests);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to check if a date falls within a range
  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    try {
      return isWithinInterval(date, { start: startDate, end: endDate });
    } catch (error) {
      console.error("Invalid date range:", error);
      return false;
    }
  };

  // Encuentra eventos para la fecha seleccionada
  const eventsForSelectedDate = teamData.filter(event => {
    // Only include approved events
    if (event.status !== 'approved') return false;
    
    try {
      return isDateInRange(date, event.startDate, event.endDate);
    } catch (error) {
      console.error("Error checking date range:", error, event);
      return false;
    }
  });

  // Estilo dinámico para días con eventos
  const hasEventOnDate = (date: Date) => {
    return teamData.some(event => {
      // Only mark dates with approved events
      if (event.status !== 'approved') return false;
      
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        console.error("Error checking date range:", error, event);
        return false;
      }
    });
  };

  return (
    <SlideIn direction="left" delay={0.2}>
      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Disponibilidad del Equipo</CardTitle>
              <CardDescription>Ver el calendario de permisos del equipo</CardDescription>
            </div>
            <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="calendar">Calendario</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Cargando datos...</div>
          ) : (
            <div className="grid md:grid-cols-7 gap-6">
              <div className="md:col-span-3">
                <div className="w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="rounded-md border w-full calendar-fixed"
                    modifiers={{
                      highlight: (date) => hasEventOnDate(date)
                    }}
                    modifiersStyles={{
                      highlight: {
                        backgroundColor: "hsl(var(--primary) / 0.15)",
                        color: "hsl(var(--primary))",
                        fontWeight: "500",
                        borderRadius: "9999px"
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="md:col-span-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {format(date, "EEEE, d 'de' MMMM 'de' yyyy")}
                  </h3>
                  <p className="text-base font-medium">
                    {eventsForSelectedDate.length === 0 
                      ? "No hay miembros del equipo con permiso" 
                      : `${eventsForSelectedDate.length} ${eventsForSelectedDate.length === 1 ? 'miembro' : 'miembros'} del equipo con permiso`
                    }
                  </p>
                </div>

                {view === "calendar" ? (
                  <div className="space-y-3">
                    {eventsForSelectedDate.length > 0 ? (
                      eventsForSelectedDate.map((event) => (
                        <div key={event.id} className="flex items-center p-3 rounded-lg border bg-background shadow-sm">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="" alt={event.username} />
                            <AvatarFallback>{event.username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{event.username}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{event.type}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {format(event.startDate, "d MMM")} 
                                {!isSameDay(event.startDate, event.endDate) && 
                                  ` - ${format(event.endDate, "d MMM")}`}
                              </span>
                            </div>
                          </div>
                          <StatusBadge status={event.status as any} className="ml-2" />
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          Nadie tiene permiso para la fecha seleccionada.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Set(teamData.map(event => event.username))).map(username => {
                      const userEvents = teamData.filter(event => 
                        event.username === username && 
                        event.status === 'approved' &&
                        (isSameMonth(event.startDate, date) || 
                         isSameMonth(event.endDate, date))
                      );
                      
                      return userEvents.length > 0 ? (
                        <div key={username as string} className="border rounded-lg overflow-hidden">
                          <div className="flex items-center gap-3 p-3 bg-muted/40">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={username as string} />
                              <AvatarFallback>
                                {(username as string).split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{username}</p>
                              <p className="text-xs text-muted-foreground">{userEvents[0].department || 'Sin departamento'}</p>
                            </div>
                          </div>
                          <div className="divide-y">
                            {userEvents.map((event) => (
                              <div key={event.id} className="flex justify-between items-center p-3">
                                <div>
                                  <p className="text-sm">{event.type}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(event.startDate, "d MMM")} 
                                    {!isSameDay(event.startDate, event.endDate) && 
                                      ` - ${format(event.endDate, "d MMM")}`}
                                  </p>
                                </div>
                                <StatusBadge status={event.status as any} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </SlideIn>
  );
};

export default TeamCalendar;
