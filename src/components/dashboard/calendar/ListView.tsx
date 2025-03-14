
import React, { memo, useMemo } from "react";
import { isSameMonth } from "date-fns";
import UserListItem from "./UserListItem";

interface Event {
  id: string;
  username: string;
  department?: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

interface ListViewProps {
  teamData: Event[];
  date: Date;
}

const ListView = ({ teamData, date }: ListViewProps) => {
  // Memoize the users with events data to avoid recalculations on each render
  const usersWithEvents = useMemo(() => {
    return Array.from(
      new Set(teamData.map(event => event.username))
    ).map(username => {
      const userEvents = teamData.filter(event => 
        event.username === username && 
        event.status === 'approved' &&
        (isSameMonth(event.startDate, date) || isSameMonth(event.endDate, date))
      );
      
      return {
        username,
        department: userEvents[0]?.department,
        events: userEvents
      };
    }).filter(user => user.events.length > 0);
  }, [teamData, date]);

  return (
    <div className="space-y-4">
      {usersWithEvents.map(user => (
        <UserListItem 
          key={user.username} 
          username={user.username} 
          department={user.department}
          events={user.events} 
        />
      ))}
    </div>
  );
};

// Memoize the list view component
export default memo(ListView);
