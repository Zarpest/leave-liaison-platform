
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import AdminTabs from "./AdminTabs";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllUsers,
  getLeaveRequests,
  User,
  LeaveBalance,
  LeaveRequest,
} from "@/services/adminService";
import RequireAdmin from "@/components/auth/RequireAdmin";

const SuperAdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<{[key: string]: LeaveBalance}>({});
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtain initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        // Get balances and convert them to an object for easy access
        const balancesObj: {[key: string]: LeaveBalance} = {};
        for (const user of usersData) {
          if (user.leave_balance) {
            balancesObj[user.id] = user.leave_balance;
          }
        }
        setLeaveBalances(balancesObj);
        
        // Get leave requests
        const requests = await getLeaveRequests();
        setLeaveRequests(requests);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Could not load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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

          <AdminTabs 
            users={users}
            setUsers={setUsers}
            leaveBalances={leaveBalances}
            setLeaveBalances={setLeaveBalances}
            leaveRequests={leaveRequests}
            loading={loading}
          />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default SuperAdminPanel;
