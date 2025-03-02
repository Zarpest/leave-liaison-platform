
import React from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import TeamCalendar from "@/components/dashboard/TeamCalendar";

const TeamPage = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View your team's leave schedule and availability
            </p>
          </div>
          
          <TeamCalendar />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default TeamPage;
