
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import StatusBadge from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay, isSameMonth } from "date-fns";
import { SlideIn } from "@/components/animations/Transitions";

// Sample team data
const teamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    avatarUrl: "https://github.com/shadcn.png",
    role: "Product Manager",
    leaves: [
      {
        id: "1",
        type: "Vacation",
        startDate: new Date("2024-05-18"),
        endDate: new Date("2024-05-23"),
        status: "approved",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Smith",
    avatarUrl: "https://github.com/shadcn.png",
    role: "UX Designer",
    leaves: [
      {
        id: "1",
        type: "Personal",
        startDate: new Date("2024-05-15"),
        endDate: new Date("2024-05-15"),
        status: "approved",
      },
    ],
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatarUrl: "",
    role: "Developer",
    leaves: [
      {
        id: "1",
        type: "Sick",
        startDate: new Date("2024-05-10"),
        endDate: new Date("2024-05-12"),
        status: "approved",
      },
      {
        id: "2",
        type: "Vacation",
        startDate: new Date("2024-05-28"),
        endDate: new Date("2024-06-04"),
        status: "pending",
      },
    ],
  },
];

const TeamCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Find events for the selected date
  const eventsForSelectedDate = teamMembers.flatMap(member => 
    member.leaves.filter(leave => 
      (date >= leave.startDate && date <= leave.endDate) || 
      isSameDay(date, leave.startDate) || 
      isSameDay(date, leave.endDate)
    ).map(leave => ({
      ...leave,
      memberName: member.name,
      memberAvatar: member.avatarUrl,
      memberInitials: member.name.split(' ').map(n => n[0]).join(''),
    }))
  );

  // Dynamic day styling for the calendar
  const dayStyles = (date: Date) => {
    // Find any team member who has leave on this date
    const hasLeave = teamMembers.some(member => 
      member.leaves.some(leave => 
        (date >= leave.startDate && date <= leave.endDate)
      )
    );
    
    return hasLeave 
      ? "bg-primary/15 text-primary font-medium rounded-full" 
      : undefined;
  };

  return (
    <SlideIn direction="left" delay={0.2}>
      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Team Availability</CardTitle>
              <CardDescription>See your team's leave schedule</CardDescription>
            </div>
            <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-7 gap-6">
            <div className="md:col-span-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border max-w-full"
                modifiers={{
                  highlight: (date) => {
                    return teamMembers.some(member => 
                      member.leaves.some(leave => 
                        (date >= leave.startDate && date <= leave.endDate)
                      )
                    );
                  }
                }}
                modifiersStyles={{
                  highlight: {
                    backgroundColor: "hsl(var(--primary) / 0.15)",
                    color: "hsl(var(--primary))",
                    fontWeight: "500",
                    borderRadius: "9999px"
                  }
                }}
              />
            </div>
            
            <div className="md:col-span-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </h3>
                <p className="text-base font-medium">
                  {eventsForSelectedDate.length === 0 
                    ? "No team members on leave" 
                    : `${eventsForSelectedDate.length} team member${eventsForSelectedDate.length !== 1 ? 's' : ''} on leave`
                  }
                </p>
              </div>

              {view === "calendar" ? (
                <div className="space-y-3">
                  {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((event) => (
                      <div key={event.id} className="flex items-center p-3 rounded-lg border bg-background shadow-sm">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={event.memberAvatar} alt={event.memberName} />
                          <AvatarFallback>{event.memberInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.memberName}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{event.type}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {format(event.startDate, "MMM d")} 
                              {!isSameDay(event.startDate, event.endDate) && 
                                ` - ${format(event.endDate, "MMM d")}`}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={event.status as any} className="ml-2" />
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No one is on leave for the selected date.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const memberLeavesThisMonth = member.leaves.filter(leave => 
                      isSameMonth(leave.startDate, date) || 
                      isSameMonth(leave.endDate, date)
                    );
                    
                    return memberLeavesThisMonth.length > 0 ? (
                      <div key={member.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-3 p-3 bg-muted/40">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="divide-y">
                          {memberLeavesThisMonth.map((leave) => (
                            <div key={leave.id} className="flex justify-between items-center p-3">
                              <div>
                                <p className="text-sm">{leave.type}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(leave.startDate, "MMM d")} 
                                  {!isSameDay(leave.startDate, leave.endDate) && 
                                    ` - ${format(leave.endDate, "MMM d")}`}
                                </p>
                              </div>
                              <StatusBadge status={leave.status as any} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </SlideIn>
  );
};

export default TeamCalendar;
