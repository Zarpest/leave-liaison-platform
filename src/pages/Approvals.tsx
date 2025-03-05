
import React, { useState, useEffect } from "react";
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
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getPendingRequestsForApprover, updateLeaveRequestStatus } from "@/services/supabaseService";
import { useAuth } from "@/context/AuthContext";

const Approvals = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const pendingRequests = await getPendingRequestsForApprover();
        setRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las solicitudes pendientes"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [toast]);

  const handleApprove = async (id: string) => {
    try {
      await updateLeaveRequestStatus(id, 'approved', "Solicitud aprobada");
      setRequests(requests.filter((request) => request.id !== id));
      toast({
        title: "Éxito",
        description: "Solicitud aprobada correctamente"
      });
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo aprobar la solicitud"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateLeaveRequestStatus(id, 'rejected', "Solicitud rechazada");
      setRequests(requests.filter((request) => request.id !== id));
      toast({
        title: "Éxito",
        description: "Solicitud rechazada correctamente"
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo rechazar la solicitud"
      });
    }
  };

  // Función para formatear fechas en español
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "d MMM yyyy", { locale: es });
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
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Cargando solicitudes...</p>
                </div>
              ) : requests.length > 0 ? (
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
                                  src=""
                                  alt={request.userName}
                                />
                                <AvatarFallback>
                                  {request.userName.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {request.userName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>
                            {formatDate(request.start_date)}
                            {request.start_date !== request.end_date && (
                              <span> - {formatDate(request.end_date)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{request.days}</TableCell>
                          <TableCell>
                            {formatDate(request.requested_on)}
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
