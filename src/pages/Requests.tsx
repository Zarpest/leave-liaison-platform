
import React from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import LeaveHistory from "@/components/dashboard/LeaveHistory";

const Requests = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
            <p className="text-muted-foreground mt-1">
              Ver y gestionar todas tus solicitudes de permisos
            </p>
          </div>
          
          <LeaveHistory />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Requests;
