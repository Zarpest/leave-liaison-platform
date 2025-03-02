
import React from "react";
import Layout from "@/components/layout/Layout";
import { PageTransition } from "@/components/animations/Transitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckIcon, FilterIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Sample pending requests data
const pendingRequests = [
  {
    id: "1",
    employeeName: "John Smith",
    employeeAvatar: "https://github.com/shadcn.png",
    employeeInitials: "JS",
    type: "Vacation Leave",
    startDate: new Date("2024-06-10"),
    endDate: new Date("2024-06-15"),
    days: 5,
    requestedOn: new Date("2024-05-20"),
    reason: "Family vacation",
  },
  {
    id: "2",
    employeeName: "Emily Johnson",
    employeeAvatar: "",
    employeeInitials: "EJ",
    type: "Sick Leave",
    startDate: new Date("2024-05-25"),
    endDate: new Date("2024-05-26"),
    days: 2,
    requestedOn: new Date("2024-05-24"),
    reason: "Not feeling well",
  },
  {
    id: "3",
    employeeName: "David Wilson",
    employeeAvatar: "",
    employeeInitials: "DW",
    type: "Personal Leave",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-06-01"),
    days: 1,
    requestedOn: new Date("2024-05-22"),
    reason: "Appointment",
  },
];

const Approvals = () => {
  const [requests, setRequests] = React.useState(pendingRequests);
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    toast({
      title: "Success",
      description: "Request approved successfully"
    });
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    toast({
      title: "Success",
      description: "Request rejected successfully"
    });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
            <p className="text-muted-foreground mt-1">
              Manage pending leave requests from your team
            </p>
          </div>

          <Card className="card-hover">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">Pending Requests</CardTitle>
                <CardDescription>
                  {requests.length} request{requests.length !== 1 ? "s" : ""} awaiting your approval
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Days</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={request.employeeAvatar}
                                  alt={request.employeeName}
                                />
                                <AvatarFallback>
                                  {request.employeeInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {request.employeeName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>
                            {format(request.startDate, "MMM d, yyyy")}
                            {!request.startDate.toDateString().includes(request.endDate.toDateString()) && (
                              <span> - {format(request.endDate, "MMM d, yyyy")}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{request.days}</TableCell>
                          <TableCell>
                            {format(request.requestedOn, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleReject(request.id)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-success hover:text-success"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center border rounded-md">
                  <p className="text-muted-foreground">
                    No pending requests to approve
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Approvals;
