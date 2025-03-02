
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
            <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your leave requests
            </p>
          </div>
          
          <LeaveHistory />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Requests;
