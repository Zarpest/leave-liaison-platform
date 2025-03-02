import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock10Icon } from "lucide-react";
import { format, differenceInBusinessDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { SlideIn } from "@/components/animations/Transitions";

const leaveTypes = [
  { value: "vacation", label: "Vacation Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "bereavement", label: "Bereavement" },
  { value: "parental", label: "Parental Leave" },
];

const RequestForm = () => {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const businessDays = React.useMemo(() => {
    if (date.from && date.to) {
      return differenceInBusinessDays(date.to, date.from) + 1;
    }
    return 0;
  }, [date.from, date.to]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date.from || !date.to || !leaveType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Leave request submitted successfully");
      setIsSubmitting(false);
      
      // Reset form
      setDate({ from: undefined, to: undefined });
      setLeaveType("");
      setReason("");
    }, 1500);
  };

  return (
    <SlideIn direction="up">
      <form onSubmit={handleSubmit}>
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Request Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select
                value={leaveType}
                onValueChange={setLeaveType}
              >
                <SelectTrigger id="leave-type" className="w-full">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.from ? format(date.from, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.from}
                      onSelect={(day) => setDate({ ...date, from: day })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date.to && "text-muted-foreground"
                      )}
                      disabled={!date.from}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date.to ? format(date.to, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date.to}
                      onSelect={(day) => setDate({ ...date, to: day })}
                      disabled={(date) => {
                        return date < (date.from ? addDays(date.from, 0) : new Date());
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {businessDays > 0 && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Clock10Icon className="h-4 w-4 mr-1" />
                  <span>{businessDays} business day{businessDays !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter details about your leave request"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </SlideIn>
  );
};

export default RequestForm;
