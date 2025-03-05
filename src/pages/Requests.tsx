
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
import { Input } from "@/components/ui/input";
import { 
  EyeIcon, 
  PlusIcon, 
  FilterIcon, 
  SearchIcon,
  FileTextIcon
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getUserLeaveRequests, LeaveRequest } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Requests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getUserLeaveRequests();
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

  // Filtrar solicitudes según el término de búsqueda
  const filteredRequests = leaveRequests.filter(
    (request) =>
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para formatear fechas desde strings ISO
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "d MMM yyyy", { locale: es });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/requests/${id}`);
  };

  const handleNewRequest = () => {
    navigate("/");
  };

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
            <p className="text-muted-foreground mt-1">
              Ver y gestionar todas tus solicitudes de permisos
            </p>
          </div>
          
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">Historial de Solicitudes</CardTitle>
                <CardDescription>Todas tus solicitudes de permisos</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar solicitudes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 w-full sm:w-auto min-w-[200px]"
                  />
                </div>
                <Button onClick={handleNewRequest}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Cargando solicitudes...</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-center">Días</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead>Solicitado el</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            {searchTerm
                              ? "No se encontraron resultados para tu búsqueda"
                              : "No hay solicitudes para mostrar"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id} className="hover:bg-muted/40">
                            <TableCell className="font-medium">{request.id.slice(0, 8)}...</TableCell>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>
                              {formatDate(request.start_date)}
                              {request.start_date !== request.end_date && (
                                <span> - {formatDate(request.end_date)}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{request.days}</TableCell>
                            <TableCell className="text-center">
                              <StatusBadge status={request.status} />
                            </TableCell>
                            <TableCell>
                              {formatDate(request.requested_on)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(request.id)}
                                className="h-8"
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {filteredRequests.length > 0 && !searchTerm && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {filteredRequests.length} solicitudes
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <FileTextIcon className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Requests;
