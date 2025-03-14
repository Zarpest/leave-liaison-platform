
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface SelectedDateInfoProps {
  date: Date;
  eventsCount: number;
}

const SelectedDateInfo = ({ date, eventsCount }: SelectedDateInfoProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">
          {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </h3>
        <p className="text-base font-medium">
          {eventsCount === 0 
            ? "No hay miembros del equipo con permiso" 
            : `${eventsCount} ${eventsCount === 1 ? 'miembro' : 'miembros'} del equipo con permiso`
          }
        </p>
      </div>
      {eventsCount > 0 && (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {eventsCount} ausencias
        </Badge>
      )}
    </div>
  );
};

export default SelectedDateInfo;
