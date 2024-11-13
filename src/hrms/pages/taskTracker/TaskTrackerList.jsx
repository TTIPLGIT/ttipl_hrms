import { useEffect, useRef, useState } from "react";
import { protectedCall } from "../../../services/userService";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Calendar } from "primereact/calendar";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../pages/login/loginSlice";

const TaskTrackerList = () => {
  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const loggedUser = useSelector(selectLoggedUser);
  const currentUser = loggedUser.employeeId;
  const calendarRef = useRef(null); // For Calendar component to detect outside click

  useEffect(() => {
    const fetchData = async () => {
      const data = await protectedCall(
        `api/employee-eod/employee/${currentUser}`
      );
      setProducts(data.length > 0 ? data : []); // Set data if available, otherwise set to empty array
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = products.filter(
        (entry) =>
          new Date(entry.attendance.check_in_time).toDateString() ===
          selectedDate.toDateString()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(products); // Show all data if no date is selected
    }
  }, [selectedDate, products]);

  // Date formatter for displaying date columns
  const formatDate = (value) => {
    return new Date(value).toLocaleString();
  };

  // Function to change date to yesterday
  const goToYesterday = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Function to change date to tomorrow
  const goToTomorrow = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div>
      <h2>Employee End of Day (EOD) Tasks</h2>

      {/* Date Navigation
      <div className="flex justify-content-center align-items-center">
        <div className="">
          <button
            className="bg-transparent border-none cursor-pointer"
            onClick={goToYesterday}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        <div className="">
          <span>
            {" "}
            <Calendar
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value)}
              dateFormat="yy-mm-dd"
              placeholder="Select a Date"
            />
          </span>
        </div>
        <div className="">
          <button
            className="bg-transparent border-none cursor-pointer"
            onClick={goToTomorrow}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div> */}

      <div className="flex justify-content-between align-items-center py-4">
        {/* Date navigation controls */}
        <div></div>
        <div className="flex align-items-center justify-content-center">
          <div
            onClick={goToYesterday}
            className="text-blue-600 font-bold cursor-pointer mx-2"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          {/* Calendar icon and date picker toggle */}
          <div className="relative mx-2" ref={calendarRef}>
            <i
              className="fa fa-calendar-days text-2xl cursor-pointer"
              onClick={() => setIsCalendarVisible((prev) => !prev)}
            ></i>
            {isCalendarVisible && (
              <div className="absolute top-100 z-2">
                <Calendar
                  inline
                  visible
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.value);
                    setIsCalendarVisible(false);
                  }}
                />
              </div>
            )}
          </div>

          <div
            onClick={goToTomorrow}
            className="text-blue-600 font-bold cursor-pointer mx-2"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>

          {/* Display Date */}
          <div className="text-sm font-bold ml-3 text-center">
            {selectedDate.toDateString()}
          </div>
        </div>

        {/* "Today" button */}
        <div className="flex justify-content-end">
          <p
            onClick={handleSetToday}
            className="bg-blue-600 text-white px-4 py-2 border-none font-bold cursor-pointer text-base border-round-sm hover:bg-blue-500"
          >
            Today
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable value={filteredData} rows={5} responsiveLayout="scroll">
        <Column field="task" header="Task"></Column>
        <Column field="time" header="Time Spent (hrs)" sortable></Column>
      </DataTable>
    </div>
  );
};

export default TaskTrackerList;
