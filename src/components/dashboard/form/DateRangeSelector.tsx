
import React from "react";
import { format, differenceInBusinessDays, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeSelectorProps {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DateRangeSelector = ({ date, setDate }: DateRangeSelectorProps) => {
  const businessDays = React.useMemo(() => {
    if (date.from && date.to) {
      return differenceInBusinessDays(date.to, date.from) + 1;
    }
    return 0;
  }, [date.from, date.to]);

  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: es });
  };

  return (
    <div className="space-y-2">
      <Label>Rango de Fechas</Label>
      <div className="flex flex-col sm:flex-row gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date.from ? formatDate(date.from) : "Fecha inicio"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date.from}
              onSelect={(day) => setDate({ ...date, from: day })}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date.to && "text-muted-foreground"
              )}
              disabled={!date.from}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date.to ? formatDate(date.to) : "Fecha fin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date.to}
              onSelect={(day) => setDate({ ...date, to: day })}
              disabled={(currentDate) => {
                const minDate = date.from ? addDays(date.from, 0) : new Date();
                return currentDate < minDate;
              }}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {businessDays > 0 && (
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Clock10Icon className="h-4 w-4 mr-1" />
          <span>
            {businessDays} día{businessDays !== 1 ? "s" : ""} laborable
            {businessDays !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
