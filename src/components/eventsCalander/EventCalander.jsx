import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { protectedCall } from "../../services/userService";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function EventCalander() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    // Fetch leave events from the API
    const fetchEvents = async () => {
      try {
        const response = await protectedCall("api/leave-request/findAll");
        console.log("response", response);

        const formattedEvents = response.map((event) => ({
          id: event.id,
          title: event.leaveType,
          start: new Date(event.startDate), // Ensure date format
          end: new Date(event.endDate), // Ensure date format
          // allDay: event.allDay,
        }));
        setEventsData(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (title) {
      setEventsData([...eventsData, { start, end, title }]);
    }
  };

  return (
    <Calendar
      views={["day", "agenda", "work_week", "month"]}
      selectable
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={eventsData}
      style={{ height: "100vh" }}
      onSelectEvent={(event) => alert(event.title)}
      onSelectSlot={handleSelect}
    />
  );
}
