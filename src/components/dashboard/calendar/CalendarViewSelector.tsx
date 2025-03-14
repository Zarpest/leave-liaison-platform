
import React from "react";
import { CalendarDays, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarViewSelectorProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
}

const CalendarViewSelector = ({ view, onViewChange }: CalendarViewSelectorProps) => {
  return (
    <Tabs 
      defaultValue="calendar" 
      value={view} 
      onValueChange={(v) => onViewChange(v as "calendar" | "list")} 
      className="w-full sm:w-auto"
    >
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
  );
};

export default CalendarViewSelector;
