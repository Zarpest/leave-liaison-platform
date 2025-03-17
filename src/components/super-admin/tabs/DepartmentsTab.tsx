
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/services/adminService";
import DepartmentCard from "../departments/DepartmentCard";

interface DepartmentsTabProps {
  users: User[];
}

const DepartmentsTab = ({ users }: DepartmentsTabProps) => {
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

  return (
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
              <DepartmentCard 
                key={dept} 
                department={dept} 
                users={deptUsers} 
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentsTab;
