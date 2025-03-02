
import React from "react";
import LeaveBalanceCard from "./LeaveBalanceCard";
import RequestForm from "./RequestForm";
import LeaveHistory from "./LeaveHistory";
import TeamCalendar from "./TeamCalendar";
import { StaggerChildren } from "@/components/animations/Transitions";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your time off and view team availability
        </p>
      </div>

      <StaggerChildren>
        <div className="grid gap-6 md:grid-cols-3">
          <LeaveBalanceCard
            title="Vacation Leave"
            total={20}
            used={8}
            description="Annual vacation days reset on January 1st"
          />
          <LeaveBalanceCard
            title="Sick Leave"
            total={12}
            used={2}
            description="Sick leave balance for the current year"
          />
          <LeaveBalanceCard
            title="Personal Time"
            total={24}
            used={10}
            description="Hours available for personal time"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RequestForm />
          <TeamCalendar />
        </div>

        <LeaveHistory />
      </StaggerChildren>
    </div>
  );
};

export default Dashboard;
