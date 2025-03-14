
import React from "react";
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
  // Filter data based on selected filters
  const filteredTeamData = teamData.filter(event => {
    // Only include approved events
    if (event.status !== 'approved') return false;
    
    // Apply type filter
    if (typeFilter !== 'all' && event.type !== typeFilter) return false;
    
    // Apply department filter
    if (departmentFilter !== 'all' && event.department !== departmentFilter) return false;
    
    return true;
  });

  // Navigate between months
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Helper function to check if a date falls within a range
  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    try {
      return isWithinInterval(date, { start: startDate, end: endDate });
    } catch (error) {
      console.error("Invalid date range:", error);
      return false;
    }
  };

  // Find events for the selected date
  const eventsForSelectedDate = filteredTeamData.filter(event => {
    try {
      return isDateInRange(date, event.startDate, event.endDate);
    } catch (error) {
      console.error("Error checking date range:", error, event);
      return false;
    }
  });

  // Get count of people with approved time off on a specific date
  const getEventCountForDate = (date: Date) => {
    return filteredTeamData.filter(event => {
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        return false;
      }
    }).length;
  };

  // Dynamic style for days with events
  const hasEventOnDate = (date: Date) => {
    return filteredTeamData.some(event => {
      try {
        return isDateInRange(date, event.startDate, event.endDate);
      } catch (error) {
        console.error("Error checking date range:", error, event);
        return false;
      }
    });
  };

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
              modifiers={{
                highlight: (date) => hasEventOnDate(date)
              }}
              modifiersStyles={{
                highlight: {
                  backgroundColor: "hsl(var(--primary) / 0.15)",
                  color: "hsl(var(--primary))",
                  fontWeight: "500",
                  borderRadius: "9999px"
                }
              }}
              components={{
                DayContent: (props) => {
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
                }
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
              <EmptyDateView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
