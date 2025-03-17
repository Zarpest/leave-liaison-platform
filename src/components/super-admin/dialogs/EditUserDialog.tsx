
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LeaveBalance, 
  updateUserDepartment, 
  updateUserLeaveBalance,
  assignApprover,
  setUserRole
} from "@/services/adminService";

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setLeaveBalances: React.Dispatch<React.SetStateAction<{[key: string]: LeaveBalance}>>;
}

// Schema for user edit form
const editUserSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  department: z.string().min(1, { message: "Seleccione un departamento" }),
  vacationDays: z.coerce.number().int().min(0),
  sickDays: z.coerce.number().int().min(0),
  personalDays: z.coerce.number().int().min(0),
  approver: z.string().optional(),
  role: z.string().optional(),
  password: z.string().optional(),
});

type EditUserValues = z.infer<typeof editUserSchema>;

const EditUserDialog = ({ 
  isOpen, 
  setIsOpen, 
  selectedUser, 
  users, 
  setUsers, 
  setLeaveBalances 
}: EditUserDialogProps) => {
  const { toast } = useToast();

  // Available departments
  const departments = [
    "Recursos Humanos",
    "Tecnología",
    "Finanzas",
    "Operaciones",
    "Marketing",
    "Ventas",
    "Legal",
    "Administración"
  ];

  // Available roles
  const roles = [
    { id: "user", name: "Usuario" },
    { id: "approver", name: "Aprobador" },
    { id: "admin", name: "Administrador" },
    { id: "super_admin", name: "Super Administrador" },
  ];

  // Form setup
  const form = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      department: selectedUser?.department || "",
      vacationDays: selectedUser?.leave_balance?.vacation_days || 20,
      sickDays: selectedUser?.leave_balance?.sick_days || 10,
      personalDays: selectedUser?.leave_balance?.personal_days || 5,
      approver: selectedUser?.approver_id || "",
      role: selectedUser?.role || "",
    },
  });

  // Reset form when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        department: selectedUser.department || "",
        vacationDays: selectedUser.leave_balance?.vacation_days || 20,
        sickDays: selectedUser.leave_balance?.sick_days || 10,
        personalDays: selectedUser.leave_balance?.personal_days || 5,
        approver: selectedUser.approver_id || "",
        role: selectedUser.role || "",
      });
    }
  }, [selectedUser, form]);

  // Handle form submission
  const onSubmit = async (data: EditUserValues) => {
    if (!selectedUser) return;
    
    try {
      // Update department
      await updateUserDepartment(selectedUser.id, data.department);
      
      // Update leave balance
      await updateUserLeaveBalance(selectedUser.id, {
        vacation_days: data.vacationDays,
        sick_days: data.sickDays,
        personal_days: data.personalDays,
      });
      
      // Assign approver if defined
      if (data.approver) {
        await assignApprover(selectedUser.id, data.approver);
      }
      
      // Update role if defined and changed
      if (data.role && data.role !== selectedUser.role) {
        await setUserRole(selectedUser.id, data.role);
      }
      
      // Update local data
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? {
          ...u, 
          department: data.department,
          approver_id: data.approver || u.approver_id,
          role: data.role || u.role,
        } : u
      ));
      
      setLeaveBalances(prev => ({
        ...prev,
        [selectedUser.id]: {
          ...prev[selectedUser.id],
          vacation_days: data.vacationDays,
          sick_days: data.sickDays,
          personal_days: data.personalDays,
        }
      }));
      
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza la información y los días disponibles del usuario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="vacationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Vacaciones</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sickDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Enfermedad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Personales</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="approver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aprobador</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar aprobador" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter(u => selectedUser && u.id !== selectedUser.id)
                          .map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                <SaveIcon className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
