
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
import { 
  format, 
  isSameDay, 
  isSameMonth, 
  isWithinInterval, 
  parseISO, 
  addMonths, 
  subMonths 
} from "date-fns";
import { SlideIn } from "@/components/animations/Transitions";
import { getAllTeamRequests } from "@/services/supabaseService";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarClock, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  CalendarDays
} from "lucide-react";

// Custom CSS to ensure calendar day numbers don't overflow
import "./TeamCalendar.css";

const TeamCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [teamData, setTeamData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  // Navigate between months
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Helper function to check if a date falls within a range
  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    try {
      return isWithinInterval(date, { start: startDate, end: endDate });
    } catch (error) {
      console.error("Invalid date range:", error);
      return false;
    }
  };

  // Find events for the selected date
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

  // Get count of people with approved time off on a specific date
  const getEventCountForDate = (date: Date) => {
    return teamData.filter(event => {
      if (event.status !== 'approved') return false;
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        return false;
      }
    }).length;
  };

  // Dynamic style for days with events
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

  // Get the event types for a specific day (for styling)
  const getEventTypesForDate = (date: Date) => {
    const typesOnDate = new Set<string>();
    
    teamData.forEach(event => {
      if (event.status === 'approved' && isDateInRange(date, event.startDate, event.endDate)) {
        typesOnDate.add(event.type);
      }
    });
    
    return Array.from(typesOnDate);
  };

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
            <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-auto">
              <TabsList className="grid w-full sm:w-[180px] grid-cols-2">
                <TabsTrigger value="calendar" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Calendario</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Lista</span>
                </TabsTrigger>
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
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={goToPreviousMonth}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="text-sm font-medium">
                      {format(currentMonth, "MMMM yyyy", { locale: es })}
                    </h3>
                    <button 
                      onClick={goToNextMonth}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-8 pb-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      className="rounded-md border w-full calendar-fixed"
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
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
                      components={{
                        DayContent: (props) => {
                          const eventCount = getEventCountForDate(props.date);
                          return (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div>{props.date.getDate()}</div>
                              {eventCount > 0 && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-[1px]">
                                  {eventCount > 3 ? (
                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                  ) : (
                                    Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-primary rounded-full" />
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-4">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </h3>
                    <p className="text-base font-medium">
                      {eventsForSelectedDate.length === 0 
                        ? "No hay miembros del equipo con permiso" 
                        : `${eventsForSelectedDate.length} ${eventsForSelectedDate.length === 1 ? 'miembro' : 'miembros'} del equipo con permiso`
                      }
                    </p>
                  </div>
                  {eventsForSelectedDate.length > 0 && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {eventsForSelectedDate.length} ausencias
                    </Badge>
                  )}
                </div>

                <div className="mt-8">
                  {view === "calendar" ? (
                    <div className="space-y-3">
                      {eventsForSelectedDate.length > 0 ? (
                        eventsForSelectedDate.map((event) => (
                          <div key={event.id} className="flex items-center p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors shadow-sm">
                            <Avatar className="h-10 w-10 mr-3 border border-primary/10">
                              <AvatarImage src="" alt={event.username} />
                              <AvatarFallback className="bg-primary/10 text-primary">{event.username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.username}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs font-normal py-0 px-1.5">{event.type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(event.startDate, "d MMM", { locale: es })} 
                                  {!isSameDay(event.startDate, event.endDate) && 
                                    ` - ${format(event.endDate, "d MMM", { locale: es })}`}
                                </span>
                              </div>
                            </div>
                            <StatusBadge status={event.status as any} className="ml-2" />
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center border rounded-lg bg-muted/20">
                          <CalendarClock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
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
                          <div key={username as string} className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
                            <div className="flex items-center gap-3 p-3 bg-muted/40">
                              <Avatar className="h-8 w-8 border border-primary/10">
                                <AvatarImage src="" alt={username as string} />
                                <AvatarFallback className="bg-primary/10 text-primary">
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
                                <div key={event.id} className="flex justify-between items-center p-3 hover:bg-muted/20 transition-colors">
                                  <div>
                                    <p className="text-sm">
                                      <Badge variant="secondary" className="text-xs font-normal py-0 px-1.5 mr-1">{event.type}</Badge>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {format(event.startDate, "d MMM", { locale: es })} 
                                      {!isSameDay(event.startDate, event.endDate) && 
                                        ` - ${format(event.endDate, "d MMM", { locale: es })}`}
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
            </div>
          )}
        </CardContent>
      </Card>
    </SlideIn>
  );
};

export default TeamCalendar;
