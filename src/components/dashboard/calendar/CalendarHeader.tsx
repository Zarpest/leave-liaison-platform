
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarHeaderProps {
  currentMonth: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

const CalendarHeader = ({ 
  currentMonth, 
  goToPreviousMonth, 
  goToNextMonth 
}: CalendarHeaderProps) => {
  return (
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
  );
};

export default CalendarHeader;
