
import React, { memo } from "react";
import { CalendarDays, Users, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarViewSelectorProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
  typeFilter: string;
  departmentFilter: string;
  onTypeFilterChange: (type: string) => void;
  onDepartmentFilterChange: (department: string) => void;
  availableTypes: string[];
  availableDepartments: string[];
}

const CalendarViewSelector = ({ 
  view, 
  onViewChange, 
  typeFilter,
  departmentFilter,
  onTypeFilterChange,
  onDepartmentFilterChange,
  availableTypes,
  availableDepartments 
}: CalendarViewSelectorProps) => {
  return (
    <div className="flex flex-col space-y-3 w-full">
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
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo de permiso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableDepartments.map(department => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CalendarViewSelector);
