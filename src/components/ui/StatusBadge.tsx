
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";

type Status = "pending" | "approved" | "rejected";

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          variant: "outline" as const,
          className: "border-warning text-warning",
          icon: <ClockIcon className="h-3 w-3 mr-1" />,
        };
      case "approved":
        return {
          label: "Approved",
          variant: "outline" as const,
          className: "border-success text-success",
          icon: <CheckIcon className="h-3 w-3 mr-1" />,
        };
      case "rejected":
        return {
          label: "Rejected",
          variant: "outline" as const,
          className: "border-destructive text-destructive",
          icon: <XIcon className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          label: "Unknown",
          variant: "outline" as const,
          className: "border-muted-foreground text-muted-foreground",
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={cn(config.className, className)}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
