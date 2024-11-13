import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog } from "primereact/dialog"; // Import PrimeReact Dialog
import { protectedCall } from "../../../../services/userService";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function TeamLeaves() {
  const [eventsData, setEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event
  const [isDialogVisible, setIsDialogVisible] = useState(false); // State to control dialog visibility

  useEffect(() => {
    // Fetch leave events from the API
    const fetchEvents = async () => {
      try {
        const response = await protectedCall(
          "api/leave-request/status/approved"
        );
        console.log("response", response);

        const formattedEvents = response.map((event) => ({
          id: event.id,
          title: event.leaveType,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          type: event.type,
          reason: event.reason,
          name: event.employee.firstName,
          email: event.employee.personalEmail,
          contactNumber: event.employee.contactNumber,
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

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event data
    setIsDialogVisible(true); // Show the dialog
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
    setSelectedEvent(null); // Reset selected event on close
  };

  console.log("selected event", selectedEvent);

  return (
    <div>
      <Calendar
        views={["day", "agenda", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={handleEventClick} // Show dialog on event click
        onSelectSlot={handleSelect}
      />

      <Dialog
        header="Leave Details"
        visible={isDialogVisible}
        style={{ width: "400px" }}
        modal
        onHide={hideDialog}
      >
        {selectedEvent && (
          <div>
            <p>
              <strong>Leave Type:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {selectedEvent.start.toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {selectedEvent.end.toLocaleDateString()}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedEvent.type}
            </p>
            <p>
              <strong>Reason:</strong> {selectedEvent.reason}
            </p>
            <p>
              <strong>Name:</strong> {selectedEvent.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedEvent.email}
            </p>
            <p>
              <strong>Contact number:</strong> {selectedEvent.contactNumber}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
