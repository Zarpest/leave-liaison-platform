
import React from "react";
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
  // Get unique usernames with approved events in the current month
  const usersWithEvents = Array.from(
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

export default ListView;
