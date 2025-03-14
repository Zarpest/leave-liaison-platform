
import React, { memo, useCallback, useMemo } from "react";
import { addMonths, subMonths, isWithinInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import CalendarHeader from "./CalendarHeader";
import EventCard from "./EventCard";
import EmptyDateView from "./EmptyDateView";
import SelectedDateInfo from "./SelectedDateInfo";

interface Event {
  id: string;
  username: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  department?: string;
}

interface CalendarViewProps {
  teamData: Event[];
  date: Date;
  setDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (month: Date) => void;
  typeFilter: string;
  departmentFilter: string;
}

const CalendarView = ({ 
  teamData, 
  date, 
  setDate, 
  currentMonth,
  setCurrentMonth,
  typeFilter,
  departmentFilter
}: CalendarViewProps) => {
  // Memoize filtered data to avoid recomputation on every render
  const filteredTeamData = useMemo(() => {
    return teamData.filter(event => {
      // Only include approved events
      if (event.status !== 'approved') return false;
      
      // Apply type filter
      if (typeFilter !== 'all' && event.type !== typeFilter) return false;
      
      // Apply department filter
      if (departmentFilter !== 'all' && event.department !== departmentFilter) return false;
      
      return true;
    });
  }, [teamData, typeFilter, departmentFilter]);

  // Memoize navigation functions
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(subMonths(currentMonth, 1));
  }, [currentMonth, setCurrentMonth]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth, setCurrentMonth]);

  // Memoize helper function
  const isDateInRange = useCallback((date: Date, startDate: Date, endDate: Date) => {
    try {
      return isWithinInterval(date, { start: startDate, end: endDate });
    } catch (error) {
      console.error("Invalid date range:", error);
      return false;
    }
  }, []);

  // Memoize events for selected date
  const eventsForSelectedDate = useMemo(() => {
    return filteredTeamData.filter(event => {
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        console.error("Error checking date range:", error, event);
        return false;
      }
    });
  }, [filteredTeamData, date, isDateInRange]);

  // Memoize the event count getter function
  const getEventCountForDate = useCallback((date: Date) => {
    return filteredTeamData.filter(event => {
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        return false;
      }
    }).length;
  }, [filteredTeamData, isDateInRange]);

  // Memoize the event checker function
  const hasEventOnDate = useCallback((date: Date) => {
    return filteredTeamData.some(event => {
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        console.error("Error checking date range:", error, event);
        return false;
      }
    });
  }, [filteredTeamData, isDateInRange]);

  // Memoize the day content renderer
  const DayContent = useCallback((props: any) => {
    const eventCount = getEventCountForDate(props.date);
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div>{props.date.getDate()}</div>
        {eventCount > 0 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-[1px]">
            {eventCount > 3 ? (
              <div className="w-1 h-1 bg-primary rounded-full" />
            ) : (
              Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary rounded-full" />
              ))
            )}
          </div>
        )}
      </div>
    );
  }, [getEventCountForDate]);

  // Memoize modifiers and styles for Calendar
  const modifiers = useMemo(() => ({
    highlight: (date: Date) => hasEventOnDate(date)
  }), [hasEventOnDate]);

  const modifiersStyles = useMemo(() => ({
    highlight: {
      backgroundColor: "hsl(var(--primary) / 0.15)",
      color: "hsl(var(--primary))",
      fontWeight: "500",
      borderRadius: "9999px"
    }
  }), []);

  return (
    <div className="grid md:grid-cols-7 gap-6">
      <div className="md:col-span-3">
        <div className="w-full">
          <CalendarHeader 
            currentMonth={currentMonth}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
          <div className="mb-8 pb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border w-full calendar-fixed"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              components={{
                DayContent
              }}
            />
          </div>
        </div>
      </div>
              
      <div className="md:col-span-4">
        <SelectedDateInfo date={date} eventsCount={eventsForSelectedDate.length} />

        <div className="mt-8">
          <div className="space-y-3">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <EmptyDateView hasActiveFilters={typeFilter !== 'all' || departmentFilter !== 'all'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the entire component
export default memo(CalendarView);
