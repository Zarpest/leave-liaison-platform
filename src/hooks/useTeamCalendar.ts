
import { useState, useEffect, useMemo } from "react";
import { addMonths, subMonths, parseISO, addDays, isAfter, isBefore } from "date-fns";
import { getAllTeamRequests } from "@/services/supabaseService";

interface TeamEvent {
  id: string;
  username: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  department?: string;
}

interface FormattedTeamEvent {
  id: string;
  username: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
  department?: string;
}

const useTeamCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [teamData, setTeamData] = useState<FormattedTeamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const teamRequests = await getAllTeamRequests();
        
        // Parse date strings to Date objects to make comparisons easier
        const formattedRequests = teamRequests.map((request: TeamEvent) => ({
          ...request,
          startDate: parseISO(request.start_date),
          endDate: parseISO(request.end_date)
        }));
        
        setTeamData(formattedRequests);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigate between months
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Extract unique values for filters
  const availableTypes = useMemo(() => {
    const types = new Set(teamData.map(event => event.type));
    return Array.from(types);
  }, [teamData]);

  const availableDepartments = useMemo(() => {
    const departments = new Set(teamData.map(event => event.department).filter(Boolean));
    return Array.from(departments) as string[];
  }, [teamData]);

  // Filter team data
  const filteredTeamData = useMemo(() => {
    return teamData.filter(event => {
      // Apply type filter
      if (typeFilter !== 'all' && event.type !== typeFilter) return false;
      
      // Apply department filter
      if (departmentFilter !== 'all' && event.department !== departmentFilter) return false;
      
      return true;
    });
  }, [teamData, typeFilter, departmentFilter]);

  // Get upcoming leaves for the next 30 days
  const upcomingLeaves = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, 30);
    
    return teamData.filter(event => {
      return (
        event.status === 'approved' &&
        (isAfter(event.startDate, today) || isAfter(event.endDate, today)) &&
        isBefore(event.startDate, futureDate)
      );
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [teamData]);

  const hasActiveFilters = typeFilter !== 'all' || departmentFilter !== 'all';

  return {
    date,
    setDate,
    view,
    setView,
    teamData,
    filteredTeamData,
    loading,
    currentMonth,
    setCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    typeFilter,
    setTypeFilter,
    departmentFilter,
    setDepartmentFilter,
    availableTypes,
    availableDepartments,
    upcomingLeaves,
    hasActiveFilters
  };
};

export default useTeamCalendar;
