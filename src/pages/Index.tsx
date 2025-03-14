
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/components/dashboard/Dashboard";
import { PageTransition } from "@/components/animations/Transitions";

const Index = () => {
  console.log("Index component rendering");
  
  useEffect(() => {
    console.log("Index mounted");
  }, []);
  
  return (
    <Layout>
      <PageTransition>
        <Dashboard />
      </PageTransition>
    </Layout>
  );
};

export default Index;
