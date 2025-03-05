
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";
import { FadeIn } from "@/components/animations/Transitions";
import { Link } from "react-router-dom";

interface LeaveBalanceCardProps {
  title: string;
  total: number;
  used: number;
  description?: string;
  className?: string;
  approver?: string;
}

const LeaveBalanceCard = ({
  title,
  total,
  used,
  description,
  className,
  approver,
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
              <span className="text-sm text-muted-foreground">de {total} días</span>
            </div>
            <Progress value={percentUsed} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usados: {used} días</span>
              <span>Restantes: {remaining} días</span>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {approver && (
              <p className="text-xs text-muted-foreground mt-2">
                Aprobador asignado: <span className="font-medium">{approver}</span>
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link 
            to="/requests" 
            className="text-xs text-primary flex items-center group"
          >
            Ver Historial
            <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      </Card>
    </FadeIn>
  );
};

export default LeaveBalanceCard;
