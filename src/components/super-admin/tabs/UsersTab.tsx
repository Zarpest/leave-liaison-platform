
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import UsersTable from "../users/UsersTable";
import EditUserDialog from "../dialogs/EditUserDialog";
import CreateUserDialog from "../dialogs/CreateUserDialog";
import PasswordDialog from "../dialogs/PasswordDialog";
import { User, LeaveBalance } from "@/services/adminService";

interface UsersTabProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  leaveBalances: {[key: string]: LeaveBalance};
  setLeaveBalances: React.Dispatch<React.SetStateAction<{[key: string]: LeaveBalance}>>;
  loading: boolean;
}

const UsersTab = ({ users, setUsers, leaveBalances, setLeaveBalances, loading }: UsersTabProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsChangingPassword(true);
    setIsPasswordDialogOpen(true);
  };

  const handleCreateUser = () => {
    setIsCreating(true);
    setIsCreateDialogOpen(true);
  };

  const handlePromoteToSuperAdmin = async (userId: string) => {
    // This will be handled by UsersTable component
  };

  return (
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
          <UsersTable
            users={users}
            setUsers={setUsers}
            leaveBalances={leaveBalances}
            onEditUser={handleEditUser}
            onChangePassword={handleChangePassword}
          />
        )}
      </CardContent>

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedUser={selectedUser}
        users={users}
        setUsers={setUsers}
        setLeaveBalances={setLeaveBalances}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        users={users}
        setUsers={setUsers}
      />

      {/* Password Dialog */}
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        selectedUser={selectedUser}
      />
    </Card>
  );
};

export default UsersTab;
