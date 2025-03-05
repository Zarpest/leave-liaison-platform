
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { ArrowLeftIcon, PrinterIcon, FilePenIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { LeaveRequest, getLeaveRequestById, updateLeaveRequestStatus } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

const DetailedHistory = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) return;

      try {
        const requestData = await getLeaveRequestById(id);
        
        if (requestData) {
          setRequest(requestData);
        } else {
          toast({
            title: "Error",
            description: "No se encontró la solicitud",
            variant: "destructive",
          });
          navigate("/requests");
        }
      } catch (error) {
        console.error("Error al obtener detalles:", error);
        toast({
          title: "Error",
          description: "Ocurrió un problema al cargar los detalles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, navigate, toast]);

  const handleCancelRequest = async () => {
    if (!id) return;
    
    setCancelling(true);
    try {
      await updateLeaveRequestStatus(id, 'rejected', 'Cancelado por el usuario');
      
      toast({
        title: "Éxito",
        description: "Solicitud cancelada correctamente"
      });
      
      // Actualizar la solicitud en la vista
      setRequest(prev => prev ? { ...prev, status: 'rejected', comments: 'Cancelado por el usuario' } : null);
      
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la solicitud",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Función para formatear fechas desde strings ISO
  const formatDate = (dateString: string, formatStr: string = "d MMM yyyy") => {
    return format(parseISO(dateString), formatStr, { locale: es });
  };

  if (loading) {
    return (
      <Layout>
        <PageTransition>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p>Cargando detalles...</p>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <PageTransition>
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <h2 className="text-xl font-semibold">Solicitud no encontrada</h2>
            <Button onClick={() => navigate("/requests")}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Volver a Solicitudes
            </Button>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalles de la Solicitud</h1>
              <p className="text-muted-foreground mt-1">
                Visualiza todos los detalles de tu solicitud
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={() => navigate("/requests")}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <PrinterIcon className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">{request.type}</CardTitle>
                  <CardDescription>
                    Solicitud #{request.id} - Creada el {formatDate(request.requested_on, "d 'de' MMMM 'de' yyyy")}
                  </CardDescription>
                </div>
                <StatusBadge status={request.status} className="mt-2 sm:mt-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fecha de Inicio</h3>
                    <p className="text-base mt-1">
                      {formatDate(request.start_date, "EEEE d 'de' MMMM 'de' yyyy")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fecha de Fin</h3>
                    <p className="text-base mt-1">
                      {formatDate(request.end_date, "EEEE d 'de' MMMM 'de' yyyy")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Duración</h3>
                    <p className="text-base mt-1">{request.days} día(s)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                    <div className="flex items-center mt-1">
                      <StatusBadge status={request.status} className="mr-2" />
                      <span>
                        {request.status === 'approved' && 'Aprobado'}
                        {request.status === 'rejected' && 'Rechazado'}
                        {request.status === 'pending' && 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  {request.approved_by && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Aprobado por</h3>
                      <p className="text-base mt-1">{request.approved_by}</p>
                    </div>
                  )}
                  {request.comments && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Comentarios</h3>
                      <p className="text-base mt-1">{request.comments}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6 print:hidden">
                <h3 className="text-lg font-medium mb-4">Acciones</h3>
                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <Button className="gap-2">
                      <FilePenIcon className="h-4 w-4" />
                      Editar Solicitud
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    disabled={request.status !== 'pending' || cancelling}
                    onClick={handleCancelRequest}
                  >
                    {cancelling ? 'Cancelando...' : 'Cancelar Solicitud'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default DetailedHistory;
