
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { UsersIcon, UserCogIcon, CalendarIcon } from "lucide-react";
import UsersTab from "./tabs/UsersTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import LeavesTab from "./tabs/LeavesTab";
import { User, LeaveBalance, LeaveRequest } from "@/services/adminService";

interface AdminTabsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  leaveBalances: {[key: string]: LeaveBalance};
  setLeaveBalances: React.Dispatch<React.SetStateAction<{[key: string]: LeaveBalance}>>;
  leaveRequests: LeaveRequest[];
  loading: boolean;
}

const AdminTabs = ({ 
  users, 
  setUsers, 
  leaveBalances, 
  setLeaveBalances, 
  leaveRequests, 
  loading 
}: AdminTabsProps) => {
  return (
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

      <TabsContent value="users">
        <UsersTab 
          users={users} 
          setUsers={setUsers} 
          leaveBalances={leaveBalances} 
          setLeaveBalances={setLeaveBalances} 
          loading={loading} 
        />
      </TabsContent>

      <TabsContent value="departments">
        <DepartmentsTab 
          users={users} 
        />
      </TabsContent>

      <TabsContent value="leaves">
        <LeavesTab 
          leaveRequests={leaveRequests} 
          users={users} 
          loading={loading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
