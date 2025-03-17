
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, LeaveRequest } from "@/services/adminService";
import LeaveRequestsTable from "../leaves/LeaveRequestsTable";

interface LeavesTabProps {
  leaveRequests: LeaveRequest[];
  users: User[];
  loading: boolean;
}

const LeavesTab = ({ leaveRequests, users, loading }: LeavesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Permiso</CardTitle>
        <CardDescription>
          Visualiza y gestiona todas las solicitudes de permiso
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 text-center">Cargando solicitudes...</div>
        ) : (
          <LeaveRequestsTable leaveRequests={leaveRequests} users={users} />
        )}
      </CardContent>
    </Card>
  );
};

export default LeavesTab;
