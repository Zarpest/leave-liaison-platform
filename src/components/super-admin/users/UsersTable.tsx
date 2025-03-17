
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyIcon, ShieldCheckIcon } from "lucide-react";
import { User, LeaveBalance, promoteToSuperAdmin } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  leaveBalances: {[key: string]: LeaveBalance};
  onEditUser: (user: User) => void;
  onChangePassword: (user: User) => void;
}

const UsersTable = ({ 
  users, 
  setUsers, 
  leaveBalances, 
  onEditUser, 
  onChangePassword 
}: UsersTableProps) => {
  const { toast } = useToast();

  // Promote to super admin
  const handlePromoteToSuperAdmin = async (userId: string) => {
    try {
      await promoteToSuperAdmin(userId);
      
      // Update users list
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

  return (
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
                  <Button variant="outline" size="sm" onClick={() => onEditUser(user)}>
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onChangePassword(user)}>
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
  );
};

export default UsersTable;
