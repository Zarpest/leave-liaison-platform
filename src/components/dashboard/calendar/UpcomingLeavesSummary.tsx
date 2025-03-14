
import React, { memo, useMemo } from "react";
import { format, addDays, isAfter, isBefore, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";

interface Event {
  id: string;
  username: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  department?: string;
}

interface UpcomingLeavesSummaryProps {
  events: Event[];
  daysToShow?: number;
}

const UpcomingLeavesSummary = ({ events, daysToShow = 30 }: UpcomingLeavesSummaryProps) => {
  // Filter events to get only upcoming ones that are approved - memoized for performance
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, daysToShow);

    return events
      .filter(event => {
        return (
          event.status === 'approved' &&
          (isAfter(event.startDate, today) || isAfter(event.endDate, today)) &&
          isBefore(event.startDate, futureDate)
        );
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events, daysToShow]);

  if (upcomingEvents.length === 0) {
    return (
      <div className="py-6 text-center border rounded-lg bg-muted/20">
        <CalendarClock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No hay permisos próximos en los siguientes {daysToShow} días.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Miembro</TableHead>
            <TableHead>Periodo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Días</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingEvents.map(event => {
            const daysCount = differenceInCalendarDays(event.endDate, event.startDate) + 1;
            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.username}</TableCell>
                <TableCell>
                  {format(event.startDate, "d MMM", { locale: es })} - {format(event.endDate, "d MMM", { locale: es })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {event.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{daysCount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(UpcomingLeavesSummary);
