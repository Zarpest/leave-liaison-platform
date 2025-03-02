
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, FilterIcon, SortAscIcon } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FadeIn } from "@/components/animations/Transitions";

// Datos de ejemplo
const leaveRequests = [
  {
    id: "1",
    type: "Vacaciones",
    startDate: new Date("2023-12-10"),
    endDate: new Date("2023-12-15"),
    days: 5,
    status: "approved",
    requestedOn: new Date("2023-11-20"),
  },
  {
    id: "2",
    type: "Permiso por Enfermedad",
    startDate: new Date("2024-01-05"),
    endDate: new Date("2024-01-06"),
    days: 2,
    status: "approved",
    requestedOn: new Date("2024-01-04"),
  },
  {
    id: "3",
    type: "Permiso Personal",
    startDate: new Date("2024-05-20"),
    endDate: new Date("2024-05-20"),
    days: 1,
    status: "pending",
    requestedOn: new Date("2024-05-14"),
  },
  {
    id: "4",
    type: "Permiso por Duelo",
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-03-13"),
    days: 4,
    status: "rejected",
    requestedOn: new Date("2024-03-08"),
  },
];

const LeaveHistory = () => {
  return (
    <FadeIn delay={0.1}>
      <Card className="card-hover">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-xl">Solicitudes Recientes</CardTitle>
            <CardDescription>Ver tus solicitudes de permisos recientes</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <FilterIcon className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <SortAscIcon className="h-4 w-4 mr-1" />
              Ordenar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Días</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Solicitado el</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{request.type}</TableCell>
                    <TableCell>
                      {format(request.startDate, "d MMM yyyy", { locale: es })}
                      {!request.startDate.toDateString().includes(request.endDate.toDateString()) && (
                        <span> - {format(request.endDate, "d MMM yyyy", { locale: es })}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{request.days}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={request.status as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      {format(request.requestedOn, "d MMM yyyy", { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" className="text-xs group">
              Ver Todas las Solicitudes
              <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default LeaveHistory;
