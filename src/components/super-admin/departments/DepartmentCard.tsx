
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { KeyIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/services/adminService";
import EditUserDialog from "../dialogs/EditUserDialog";
import PasswordDialog from "../dialogs/PasswordDialog";

interface DepartmentCardProps {
  department: string;
  users: User[];
}

const DepartmentCard = ({ department, users }: DepartmentCardProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  return (
    <>
      <Card key={department} className="overflow-hidden">
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-lg">{department}</CardTitle>
          <CardDescription>{users.length} usuarios</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <Table>
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

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedUser={selectedUser}
        users={users}
        setUsers={() => {}}
        setLeaveBalances={() => {}}
      />

      {/* Password Dialog */}
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default DepartmentCard;
