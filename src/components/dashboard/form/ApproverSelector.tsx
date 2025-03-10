
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/services/adminService";

interface ApproverSelectorProps {
  approvers: User[];
  selectedApproverId: string;
  setSelectedApproverId: (value: string) => void;
}

const ApproverSelector = ({
  approvers,
  selectedApproverId,
  setSelectedApproverId,
}: ApproverSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="approver">Enviar solicitud a</Label>
      <Select
        value={selectedApproverId}
        onValueChange={setSelectedApproverId}
      >
        <SelectTrigger id="approver" className="w-full">
          <SelectValue placeholder="Selecciona un aprobador" />
        </SelectTrigger>
        <SelectContent>
          {approvers.length > 0 ? (
            approvers.map((approver) => (
              <SelectItem key={approver.id} value={approver.id}>
                {approver.name} {approver.department ? `(${approver.department})` : ''}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-approvers" disabled>
              No hay aprobadores disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ApproverSelector;
