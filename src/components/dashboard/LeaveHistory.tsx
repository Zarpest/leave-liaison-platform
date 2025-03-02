
import React, { useState, useEffect } from "react";
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
import { ArrowRightIcon, FilterIcon, SortAscIcon, EyeIcon } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FadeIn } from "@/components/animations/Transitions";
import { getLeaveRequests, LeaveRequest } from "@/services/googleSheetsService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getLeaveRequests();
        setLeaveRequests(requests);
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las solicitudes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [toast]);

  const handleViewDetails = (id: string) => {
    navigate(`/requests/${id}`);
  };

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
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Cargando solicitudes...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-center">Días</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Solicitado el</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No hay solicitudes para mostrar
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveRequests.map((request) => (
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
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDetails(request.id)}
                              className="h-8 w-8"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs group"
                  onClick={() => navigate("/requests")}
                >
                  Ver Todas las Solicitudes
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default LeaveHistory;
