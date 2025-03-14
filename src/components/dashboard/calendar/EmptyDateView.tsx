
import React from "react";
import { CalendarClock } from "lucide-react";

const EmptyDateView = () => {
  return (
    <div className="py-8 text-center border rounded-lg bg-muted/20">
      <CalendarClock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">
        Nadie tiene permiso para la fecha seleccionada.
      </p>
    </div>
  );
};

export default EmptyDateView;
