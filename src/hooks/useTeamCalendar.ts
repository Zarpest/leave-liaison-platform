import { useState, useEffect } from "react";
import { addMonths, subMonths, parseISO } from "date-fns";
import { getAllTeamRequests } from "@/services/supabaseService";

interface TeamEvent {
  id: string;
  username: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  department?: string;
  // Other fields
}

interface FormattedTeamEvent {
  id: string;
  username: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
  department?: string;
  // Other fields with dates converted to Date objects
}

const useTeamCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [teamData, setTeamData] = useState<FormattedTeamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  return {
    date,
    setDate,
    view,
    setView,
    teamData,
    loading,
    currentMonth,
    setCurrentMonth,
    goToPreviousMonth,
    goToNextMonth
  };
};

export default useTeamCalendar;
