
import React from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckIcon, FilterIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Datos de ejemplo de solicitudes pendientes
const pendingRequests = [
  {
    id: "1",
    employeeName: "Juan García",
    employeeAvatar: "https://github.com/shadcn.png",
    employeeInitials: "JG",
    type: "Vacaciones",
    startDate: new Date("2024-06-10"),
    endDate: new Date("2024-06-15"),
    days: 5,
    requestedOn: new Date("2024-05-20"),
    reason: "Vacaciones familiares",
  },
  {
    id: "2",
    employeeName: "María Rodríguez",
    employeeAvatar: "",
    employeeInitials: "MR",
    type: "Permiso por Enfermedad",
    startDate: new Date("2024-05-25"),
    endDate: new Date("2024-05-26"),
    days: 2,
    requestedOn: new Date("2024-05-24"),
    reason: "No me encuentro bien",
  },
  {
    id: "3",
    employeeName: "David Sánchez",
    employeeAvatar: "",
    employeeInitials: "DS",
    type: "Permiso Personal",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-01"),
    days: 1,
    requestedOn: new Date("2024-05-22"),
    reason: "Cita médica",
  },
];

const Approvals = () => {
  const [requests, setRequests] = React.useState(pendingRequests);
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    toast({
      title: "Éxito",
      description: "Solicitud aprobada correctamente"
    });
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    toast({
      title: "Éxito",
      description: "Solicitud rechazada correctamente"
    });
  };

  // Función para formatear fechas en español
  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: es });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aprobaciones</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las solicitudes de permisos pendientes de tu equipo
            </p>
          </div>

          <Card className="card-hover">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">Solicitudes Pendientes</CardTitle>
                <CardDescription>
                  {requests.length} solicitud{requests.length !== 1 ? "es" : ""} esperando tu aprobación
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filtrar
              </Button>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-center">Días</TableHead>
                        <TableHead>Solicitado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={request.employeeAvatar}
                                  alt={request.employeeName}
                                />
                                <AvatarFallback>
                                  {request.employeeInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {request.employeeName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>
                            {formatDate(request.startDate)}
                            {!request.startDate.toDateString().includes(request.endDate.toDateString()) && (
                              <span> - {formatDate(request.endDate)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{request.days}</TableCell>
                          <TableCell>
                            {formatDate(request.requestedOn)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleReject(request.id)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-success hover:text-success"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center border rounded-md">
                  <p className="text-muted-foreground">
                    No hay solicitudes pendientes para aprobar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Approvals;
