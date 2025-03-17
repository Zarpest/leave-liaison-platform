
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, LeaveRequest } from "@/services/adminService";

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  users: User[];
}

const LeaveRequestsTable = ({ leaveRequests, users }: LeaveRequestsTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead className="text-center">Días</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Aprobador</TableHead>
            <TableHead>Solicitado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => {
              const requestUser = users.find(u => u.id === request.user_id);
              return (
                <TableRow key={request.id}>
                  <TableCell>
                    {requestUser?.name || "Usuario desconocido"}
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    {new Date(request.start_date).toLocaleDateString()} 
                    {request.start_date !== request.end_date && 
                      ` - ${new Date(request.end_date).toLocaleDateString()}`}
                  </TableCell>
                  <TableCell className="text-center">{request.days}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status === 'approved' ? 'Aprobado' : 
                        request.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </TableCell>
                  <TableCell>{request.approved_by || "Pendiente"}</TableCell>
                  <TableCell>{new Date(request.requested_on).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No hay solicitudes de permiso registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveRequestsTable;
