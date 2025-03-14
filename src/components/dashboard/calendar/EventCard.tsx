
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { isSameDay } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    username: string;
    status: string;
    type: string;
    startDate: Date;
    endDate: Date;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="flex items-center p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors shadow-sm">
      <Avatar className="h-10 w-10 mr-3 border border-primary/10">
        <AvatarImage src="" alt={event.username} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {event.username.split(' ').map((n: string) => n[0]).join('')}
        </AvatarFallback>
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
  );
};

export default EventCard;
