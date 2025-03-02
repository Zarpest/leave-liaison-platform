
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";
import { FadeIn } from "@/components/animations/Transitions";

interface LeaveBalanceCardProps {
  title: string;
  total: number;
  used: number;
  description?: string;
  className?: string;
}

const LeaveBalanceCard = ({
  title,
  total,
  used,
  description,
  className,
}: LeaveBalanceCardProps) => {
  const remaining = total - used;
  const percentUsed = Math.round((used / total) * 100);
  
  return (
    <FadeIn>
      <Card className={`overflow-hidden h-full card-hover ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">{remaining}</span>
              <span className="text-sm text-muted-foreground">of {total} days</span>
            </div>
            <Progress value={percentUsed} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Used: {used} days</span>
              <span>Remaining: {remaining} days</span>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <a 
            href="#" 
            className="text-xs text-primary flex items-center group"
          >
            View History
            <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </CardFooter>
      </Card>
    </FadeIn>
  );
};

export default LeaveBalanceCard;
