
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  updateUserLeaveBalance,
  assignApprover,
  createUser,
  getAllUsers
} from "@/services/adminService";

interface CreateUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

// Schema for create user form
const createUserSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  department: z.string().min(1, { message: "Seleccione un departamento" }),
  vacationDays: z.coerce.number().int().min(0),
  sickDays: z.coerce.number().int().min(0),
  personalDays: z.coerce.number().int().min(0),
  approver: z.string().optional(),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.string().optional(),
});

type CreateUserValues = z.infer<typeof createUserSchema>;

const CreateUserDialog = ({ isOpen, setIsOpen, users, setUsers }: CreateUserDialogProps) => {
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
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      vacationDays: 20,
      sickDays: 10,
      personalDays: 5,
      approver: "",
      password: "",
      role: "user",
    },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        email: "",
        department: "",
        vacationDays: 20,
        sickDays: 10,
        personalDays: 5,
        approver: "",
        password: "",
        role: "user",
      });
    }
  }, [isOpen, form]);

  // Handle form submission
  const onSubmit = async (data: CreateUserValues) => {
    try {
      const userId = await createUser(
        data.email,
        data.password,
        data.name,
        data.department,
        data.role
      );
      
      if (userId) {
        // Update leave balance
        await updateUserLeaveBalance(userId, {
          vacation_days: data.vacationDays,
          sick_days: data.sickDays,
          personal_days: data.personalDays,
        });
        
        // Assign approver if defined
        if (data.approver) {
          await assignApprover(userId, data.approver);
        }
        
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        });
        
        // Reload users
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Ingresa la información para crear un nuevo usuario.
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        {users.map((u) => (
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
                Crear Usuario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
