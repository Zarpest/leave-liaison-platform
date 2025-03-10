
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import { format, differenceInBusinessDays, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SlideIn } from "@/components/animations/Transitions";
import { createLeaveRequest } from "@/services/supabaseService";
import { getAllUsers, User } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";

const leaveTypes = [
  { value: "Vacaciones", label: "Vacaciones" },
  { value: "Permiso por Enfermedad", label: "Permiso por Enfermedad" },
  { value: "Permiso Personal", label: "Permiso Personal" },
  { value: "Permiso por Duelo", label: "Permiso por Duelo" },
  { value: "Permiso Parental", label: "Permiso Parental" },
];

const RequestForm = () => {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [approvers, setApprovers] = useState<User[]>([]);
  const [selectedApproverId, setSelectedApproverId] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch potential approvers
  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        console.log("Fetching approvers...");
        const users = await getAllUsers();
        // Filter out the current user and show only users that could be approvers
        const filteredUsers = users.filter(u => u.id !== user?.id);
        console.log("Available approvers:", filteredUsers);
        setApprovers(filteredUsers);
        
        // If the user has a default approver_id set, use it
        if (user && user.approver_id) {
          setSelectedApproverId(user.approver_id);
          console.log("Default approver set:", user.approver_id);
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los aprobadores. Por favor, intenta de nuevo."
        });
      }
    };
    
    if (user) {
      fetchApprovers();
    }
  }, [user, toast]);

  const businessDays = React.useMemo(() => {
    if (date.from && date.to) {
      return differenceInBusinessDays(date.to, date.from) + 1;
    }
    return 0;
  }, [date.from, date.to]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date.from || !date.to || !leaveType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos requeridos"
      });
      return;
    }
    
    if (!selectedApproverId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un aprobador para tu solicitud"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convertir fechas a formato ISO string para Supabase
      const startDate = date.from.toISOString().split('T')[0];
      const endDate = date.to.toISOString().split('T')[0];
      
      const result = await createLeaveRequest({
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days: businessDays,
        comments: reason || undefined,
        approver_id: selectedApproverId
      });
      
      if (result) {
        toast({
          title: "Éxito",
          description: "Solicitud de permiso enviada correctamente"
        });
        
        // Resetear formulario
        setDate({ from: undefined, to: undefined });
        setLeaveType("");
        setReason("");
      } else {
        throw new Error("No se pudo crear la solicitud");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la solicitud. Inténtalo de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para formatear fechas en español
  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: es });
  };

  return (
    <SlideIn direction="up">
      <form onSubmit={handleSubmit}>
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Solicitar Permiso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Tipo de Permiso</Label>
              <Select
                value={leaveType}
                onValueChange={setLeaveType}
              >
                <SelectTrigger id="leave-type" className="w-full">
                  <SelectValue placeholder="Selecciona tipo de permiso" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.from ? formatDate(date.from) : "Fecha inicio"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.from}
                      onSelect={(day) => setDate({ ...date, from: day })}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.to && "text-muted-foreground"
                      )}
                      disabled={!date.from}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.to ? formatDate(date.to) : "Fecha fin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.to}
                      onSelect={(day) => setDate({ ...date, to: day })}
                      disabled={(currentDate) => {
                        const minDate = date.from ? addDays(date.from, 0) : new Date();
                        return currentDate < minDate;
                      }}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {businessDays > 0 && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Clock10Icon className="h-4 w-4 mr-1" />
                  <span>{businessDays} día{businessDays !== 1 ? 's' : ''} laborable{businessDays !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

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
