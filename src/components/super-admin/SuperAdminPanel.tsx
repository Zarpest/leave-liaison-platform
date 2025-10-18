
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

const SuperAdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<{[key: string]: LeaveBalance}>({});
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Cargar datos principales
  const fetchData = async () => {
    try {
      console.log("Cargando datos del panel...");
      
      const usersData = await getAllUsers();
      console.log("Usuarios cargados:", usersData.length);
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
      console.log("Solicitudes cargadas:", requests.length);
      setLeaveRequests(requests);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    }
  };

  // Inicializar panel solo una vez
  useEffect(() => {
    const initializePanel = async () => {
      try {
        setInitializing(true);
        setLoading(true);
        
        // Cargar los datos
        await fetchData();
        
      } catch (error) {
        console.error("Error inicializando panel:", error);
        toast({
          title: "Error",
          description: "Error al inicializar el panel",
          variant: "destructive",
        });
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    };

    initializePanel();
  }, []);

  // Función para refrescar datos (sin verificar roles nuevamente)
  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <Layout>
        <PageTransition>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Inicializando panel de administración...</p>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

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
            onRefreshData={refreshData}
          />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default SuperAdminPanel;
