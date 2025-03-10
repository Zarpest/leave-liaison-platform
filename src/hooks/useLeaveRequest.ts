
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, User } from "@/services/adminService";
import { createLeaveRequest } from "@/services/supabaseService";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const useLeaveRequest = () => {
  const [date, setDate] = useState<DateRange>({
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

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        console.log("Fetching approvers...");
        const users = await getAllUsers();
        const filteredUsers = users.filter(u => u.id !== user?.id);
        console.log("Available approvers:", filteredUsers);
        setApprovers(filteredUsers);
        
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
      const startDate = date.from.toISOString().split('T')[0];
      const endDate = date.to.toISOString().split('T')[0];
      
      const result = await createLeaveRequest({
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        days: calculateBusinessDays(),
        comments: reason || undefined,
        approver_id: selectedApproverId
      });
      
      if (result) {
        toast({
          title: "Éxito",
          description: "Solicitud de permiso enviada correctamente"
        });
        
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

  const calculateBusinessDays = () => {
    if (date.from && date.to) {
      const diff = require('date-fns').differenceInBusinessDays;
      return diff(date.to, date.from) + 1;
    }
    return 0;
  };

  return {
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
  };
};
