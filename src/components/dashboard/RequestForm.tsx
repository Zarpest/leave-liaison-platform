
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SlideIn } from "@/components/animations/Transitions";
import { useLeaveRequest } from "@/hooks/useLeaveRequest";
import DateRangeSelector from "./form/DateRangeSelector";
import LeaveTypeSelector from "./form/LeaveTypeSelector";
import ApproverSelector from "./form/ApproverSelector";

const RequestForm = () => {
  const {
    date,
    setDate,
    leaveType,
    setLeaveType,
    reason,
    setReason,
    isSubmitting,
    approvers,
    selectedApproverId,
    setSelectedApproverId,
    handleSubmit,
  } = useLeaveRequest();

  return (
    <SlideIn direction="up">
      <form onSubmit={handleSubmit}>
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Solicitar Permiso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LeaveTypeSelector 
              leaveType={leaveType} 
              setLeaveType={setLeaveType} 
            />

            <ApproverSelector
              approvers={approvers}
              selectedApproverId={selectedApproverId}
              setSelectedApproverId={setSelectedApproverId}
            />

            <DateRangeSelector 
              date={date} 
              setDate={setDate} 
            />

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo (Opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ingresa detalles sobre tu solicitud de permiso"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </SlideIn>
  );
};

export default RequestForm;
