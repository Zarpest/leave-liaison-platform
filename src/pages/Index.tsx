
import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/components/dashboard/Dashboard";
import { PageTransition } from "@/components/animations/Transitions";

const Index = () => {
  return (
    <Layout>
      <PageTransition>
        <Dashboard />
      </PageTransition>
    </Layout>
  );
};

export default Index;
