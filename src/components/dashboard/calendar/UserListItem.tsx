
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface UserEvent {
  id: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

interface UserListItemProps {
  username: string;
  department?: string;
  events: UserEvent[];
}

const UserListItem = ({ username, department, events }: UserListItemProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
      <div className="flex items-center gap-3 p-3 bg-muted/40">
        <Avatar className="h-8 w-8 border border-primary/10">
          <AvatarImage src="" alt={username} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {username.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-muted-foreground">{department || 'Sin departamento'}</p>
        </div>
      </div>
      <div className="divide-y">
        {events.map((event) => (
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
  );
};

export default UserListItem;
