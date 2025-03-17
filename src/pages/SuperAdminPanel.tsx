import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  PlusIcon, 
  SaveIcon, 
  UserCogIcon, 
  UsersIcon, 
  CalendarIcon, 
  KeyIcon,
  UserPlusIcon,
  ShieldCheckIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { 
  getAllUsers,
  updateUserDepartment,
  updateUserLeaveBalance,
  getLeaveRequests,
  assignApprover,
  User,
  LeaveBalance,
  LeaveRequest,
  createUser,
  updateUserPassword,
  isSuperAdmin,
  setUserRole,
  promoteToSuperAdmin
} from "@/services/adminService";
import RequireAdmin from "@/components/auth/RequireAdmin";

// Schema para el formulario de edición de usuario
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

// Schema para crear nuevo usuario
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

// Schema para cambiar contraseña
const passwordSchema = z.object({
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type EditUserValues = z.infer<typeof editUserSchema>;
type CreateUserValues = z.infer<typeof createUserSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const SuperAdminPanel = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<{[key: string]: LeaveBalance}>({});
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Formularios
  const editForm = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      vacationDays: 20,
      sickDays: 10,
      personalDays: 5,
      approver: "",
      role: "",
      password: "",
    },
  });

  const createForm = useForm<CreateUserValues>({
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

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Obtener datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        // Obtener los balances y convertirlos a un objeto para fácil acceso
        const balancesObj: {[key: string]: LeaveBalance} = {};
        for (const user of usersData) {
          if (user.leave_balance) {
            balancesObj[user.id] = user.leave_balance;
          }
        }
        setLeaveBalances(balancesObj);
        
        // Obtener solicitudes de permisos
        const requests = await getLeaveRequests();
        setLeaveRequests(requests);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Editar usuario
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      vacationDays: user.leave_balance?.vacation_days || 20,
      sickDays: user.leave_balance?.sick_days || 10,
      personalDays: user.leave_balance?.personal_days || 5,
      approver: user.approver_id || "",
      role: user.role || "",
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Cambiar contraseña
  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    passwordForm.reset({
      password: "",
    });
    setIsChangingPassword(true);
    setIsPasswordDialogOpen(true);
  };

  // Guardar edición de usuario
  const onSubmitEdit = async (data: EditUserValues) => {
    if (!selectedUser) return;
    
    try {
      // Actualizar departamento
      await updateUserDepartment(selectedUser.id, data.department);
      
      // Actualizar balance de días
      await updateUserLeaveBalance(selectedUser.id, {
        vacation_days: data.vacationDays,
        sick_days: data.sickDays,
        personal_days: data.personalDays,
      });
      
      // Asignar aprobador si está definido
      if (data.approver) {
        await assignApprover(selectedUser.id, data.approver);
      }
      
      // Actualizar rol si está definido y ha cambiado
      if (data.role && data.role !== selectedUser.role) {
        await setUserRole(selectedUser.id, data.role);
      }
      
      // Actualizar datos locales
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
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  // Crear nuevo usuario
  const handleCreateUser = () => {
    createForm.reset({
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
    setIsCreating(true);
    setIsCreateDialogOpen(true);
  };

  // Guardar nuevo usuario
  const onSubmitCreate = async (data: CreateUserValues) => {
    try {
      const userId = await createUser(
        data.email,
        data.password,
        data.name,
        data.department,
        data.role
      );
      
      if (userId) {
        // Actualizar balance de días
        await updateUserLeaveBalance(userId, {
          vacation_days: data.vacationDays,
          sick_days: data.sickDays,
          personal_days: data.personalDays,
        });
        
        // Asignar aprobador si está definido
        if (data.approver) {
          await assignApprover(userId, data.approver);
        }
        
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        });
        
        // Recargar usuarios
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        setIsCreateDialogOpen(false);
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

  // Cambiar contraseña
  const onSubmitPassword = async (data: PasswordValues) => {
    if (!selectedUser) return;
    
    try {
      await updateUserPassword(selectedUser.id, data.password);
      
      toast({
        title: "Éxito",
        description: "Contraseña actualizada correctamente",
      });
      
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    }
  };

  // Promover a super admin
  const handlePromoteToSuperAdmin = async (userId: string) => {
    try {
      await promoteToSuperAdmin(userId);
      
      // Actualizar lista de usuarios
      setUsers(prev => prev.map(u => 
        u.id === userId ? {
          ...u, 
          role: 'super_admin',
        } : u
      ));
      
      toast({
        title: "Éxito",
        description: "Usuario promovido a Super Administrador",
      });
    } catch (error) {
      console.error("Error al promover usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo promover al usuario",
        variant: "destructive",
      });
    }
  };

  // Departamentos disponibles
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

  // Roles disponibles
  const roles = [
    { id: "user", name: "Usuario" },
    { id: "approver", name: "Aprobador" },
    { id: "admin", name: "Administrador" },
    { id: "super_admin", name: "Super Administrador" },
  ];

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Super Administrador</h1>
            <p className="text-muted-foreground mt-1">
              Gestión completa de usuarios, departamentos, permisos y configuración del sistema
            </p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="users">
                <UsersIcon className="mr-2 h-4 w-4" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="departments">
                <UserCogIcon className="mr-2 h-4 w-4" />
                Departamentos
              </TabsTrigger>
              <TabsTrigger value="leaves">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Solicitudes
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de usuarios */}
              <TabsContent value="users">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Usuarios</CardTitle>
                      <CardDescription>
                        Administra la información de los usuarios, departamentos y días disponibles
                      </CardDescription>
                    </div>
                    <Button onClick={handleCreateUser}>
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Nuevo Usuario
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-10 text-center">Cargando usuarios...</div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Usuario</TableHead>
                              <TableHead>Departamento</TableHead>
                              <TableHead className="text-center">Días Vacaciones</TableHead>
                              <TableHead className="text-center">Días Enfermedad</TableHead>
                              <TableHead className="text-center">Días Personales</TableHead>
                              <TableHead className="text-center">Aprobador</TableHead>
                              <TableHead className="text-center">Rol</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src="" alt={user.name} />
                                      <AvatarFallback>
                                        {user.name?.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{user.name}</span>
                                      <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{user.department || "Sin asignar"}</TableCell>
                                <TableCell className="text-center">{leaveBalances[user.id]?.vacation_days || 0}</TableCell>
                                <TableCell className="text-center">{leaveBalances[user.id]?.sick_days || 0}</TableCell>
                                <TableCell className="text-center">{leaveBalances[user.id]?.personal_days || 0}</TableCell>
                                <TableCell className="text-center">{user.approver || "No asignado"}</TableCell>
                                <TableCell className="text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 
                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                                    user.role === 'approver' ? 'bg-green-100 text-green-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role === 'super_admin' ? 'Super Admin' : 
                                     user.role === 'admin' ? 'Administrador' : 
                                     user.role === 'approver' ? 'Aprobador' : 'Usuario'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                      Editar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleChangePassword(user)}>
                                      <KeyIcon className="h-4 w-4" />
                                    </Button>
                                    {user.role !== 'super_admin' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handlePromoteToSuperAdmin(user.id)}
                                      >
                                        <ShieldCheckIcon className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña de departamentos */}
              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Departamentos</CardTitle>
                    <CardDescription>
                      Visualiza y organiza los usuarios por departamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {departments.map((dept) => {
                        const deptUsers = users.filter(u => u.department === dept);
                        
                        return (
                          <Card key={dept} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 py-3">
                              <CardTitle className="text-lg">{dept}</CardTitle>
                              <CardDescription>{deptUsers.length} usuarios</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                              {deptUsers.length > 0 ? (
                                <Table>
                                  <TableBody>
                                    {deptUsers.map((user) => (
                                      <TableRow key={user.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage src="" alt={user.name} />
                                              <AvatarFallback>
                                                {user.name?.split(' ').map(n => n[0]).join('')}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <span className="font-medium">{user.name}</span>
                                              <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                              Editar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleChangePassword(user)}>
                                              <KeyIcon className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <div className="py-4 text-center text-muted-foreground">
                                  No hay usuarios en este departamento
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña de solicitudes de permiso */}
              <TabsContent value="leaves">
                <Card>
                  <CardHeader>
                    <CardTitle>Solicitudes de Permiso</CardTitle>
                    <CardDescription>
                      Visualiza y gestiona todas las solicitudes de permiso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-10 text-center">Cargando solicitudes...</div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Usuario</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Fechas</TableHead>
                              <TableHead className="text-center">Días</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Aprobador</TableHead>
                              <TableHead>Solicitado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leaveRequests.length > 0 ? (
                              leaveRequests.map((request) => {
                                const requestUser = users.find(u => u.id === request.user_id);
                                return (
                                  <TableRow key={request.id}>
                                    <TableCell>
                                      {requestUser?.name || "Usuario desconocido"}
                                    </TableCell>
                                    <TableCell>{request.type}</TableCell>
                                    <TableCell>
                                      {new Date(request.start_date).toLocaleDateString()} 
                                      {request.start_date !== request.end_date && 
                                        ` - ${new Date(request.end_date).toLocaleDateString()}`}
                                    </TableCell>
                                    <TableCell className="text-center">{request.days}</TableCell>
                                    <TableCell>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {request.status === 'approved' ? 'Aprobado' : 
                                         request.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                      </span>
                                    </TableCell>
                                    <TableCell>{request.approved_by || "Pendiente"}</TableCell>
                                    <TableCell>{new Date(request.requested_on).toLocaleDateString()}</TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                  No hay solicitudes de permiso registradas
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Diálogo para editar usuario */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogDescription>
                  Actualiza la información y los días disponibles del usuario.
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
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
                      control={editForm.control}
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
                    control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                    control={editForm.control}
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
                                .filter(u => u.id !== selectedUser?.id)
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
                    control={editForm.control}
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

          {/* Diálogo para crear usuario */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Ingresa la información para crear un nuevo usuario.
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
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
                      control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                    control={createForm.control}
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
                    control={createForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <
