
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const leaveTypes = [
  { value: "Vacaciones", label: "Vacaciones" },
  { value: "Permiso por Enfermedad", label: "Permiso por Enfermedad" },
  { value: "Permiso Personal", label: "Permiso Personal" },
  { value: "Permiso por Duelo", label: "Permiso por Duelo" },
  { value: "Permiso Parental", label: "Permiso Parental" },
];

interface LeaveTypeSelectorProps {
  leaveType: string;
  setLeaveType: (value: string) => void;
}

const LeaveTypeSelector = ({ leaveType, setLeaveType }: LeaveTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="leave-type">Tipo de Permiso</Label>
      <Select value={leaveType} onValueChange={setLeaveType}>
        <SelectTrigger id="leave-type" className="w-full">
          <SelectValue placeholder="Selecciona tipo de permiso" />
        </SelectTrigger>
        <SelectContent>
          {leaveTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LeaveTypeSelector;
