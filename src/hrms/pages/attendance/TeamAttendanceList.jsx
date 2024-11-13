import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { protectedCall } from "../../../services/userService";
import { Calendar } from "primereact/calendar";
import timesheet from "../../../assests/images/timesheet.png";
import { Dialog } from "primereact/dialog";
import InfinityLoader from "../../../components/loader/Infinity";

const TeamAttendanceList = () => {
  const [products, setProducts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false); // Control Dialog visibility
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); // Store attendance data for all employees
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date from the calendar
  const [formattedData, setFormattedData] = useState([]); // Formatted attendance data for table display
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); // Track selected employee's ID for time sheet
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [load, setLoader] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const calendarRef = useRef(null); // For Calendar component to detect outside click

  // Calculate total hours for tasks in the timesheet
  const totalHours = products.reduce(
    (sum, product) => sum + (parseFloat(product.time) || 0),
    0
  );

  const formatData = (date) => {
    return attendanceData
      .filter((entry) => {
        return (
          new Date(entry.check_in_time).toLocaleDateString() ===
          date.toLocaleDateString()
        );
      })
      .map((entry) => {
        const checkInTime = new Date(entry.check_in_time);
        const checkOutTime = entry.check_out_time
          ? new Date(entry.check_out_time)
          : null;

        const totalHrs =
          checkInTime && checkOutTime
            ? Math.round((checkOutTime - checkInTime) / 3600000)
            : 0;

        return {
          id: entry.id,
          employee_id: entry.emp_id,
          emp_id: entry.employee.employeeId,
          emp_name: entry.employee.firstName,
          date: checkInTime.toLocaleDateString(),
          checkIn: checkInTime.toLocaleTimeString(),
          checkOut: checkOutTime ? checkOutTime.toLocaleTimeString() : "-",
          totalHrs: totalHrs.toFixed(2),
          status: checkInTime
            ? checkOutTime
              ? "Completed"
              : "In Progress"
            : "Absent",
        };
      });
  };

  const goToYesterday = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToTomorrow = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const data = await protectedCall("api/Attendance");
        setAttendanceData(data.length > 0 ? data : []);
      } catch (err) {
        console.error("Failed to load attendance data:", err);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const data = await protectedCall(
        `api/employee-eod/employee/${selectedEmployeeId}/${selectedAttendanceId}`
      );
      setProducts(data.length > 0 ? data : []);
      console.log("data", data);
    };
    fetchData();
    setLoader(false);
  }, [selectedEmployeeId, selectedAttendanceId]);

  useEffect(() => {
    setFormattedData(formatData(selectedDate));
  }, [selectedDate, attendanceData]);

  const viewTimeSheet = (rowData) => {
    console.log("row", rowData);
    setSelectedEmployeeId(rowData.employee_id);
    setSelectedAttendanceId(rowData.id);
    setSelectedEmployeeName(rowData.emp_name);
    setDialogVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDialog = () => {
    setDialogVisible(false); // Close the dialog
  };
  const handleSetToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <>
      {load && <InfinityLoader />}

      <div className="flex justify-content-center py-4 ">
        {/* Button to set the current date */}

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

          {/* Display Date Range */}
          <div className="text-sm font-bold ml-3">
            {selectedDate.toDateString()}
          </div>
        </div>
      </div>
      <p
        onClick={handleSetToday}
        className="w-1 bg-blue-600 text-white px-4 py-2 border-none font-bold cursor-pointer text-base border-round-sm hover:bg-blue-500"
      >
        Today
      </p>

      <DataTable
        value={formattedData}
        responsiveLayout="scroll"
        paginator
        rows={5}
      >
        <Column field="emp_id" header="Employee ID" />
        <Column field="emp_name" header="Employee Name" />
        <Column field="checkIn" header="Check-In Time" />
        <Column field="checkOut" header="Check-Out Time" />
        <Column field="totalHrs" header="Total Hours" />
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <span
              style={{
                color:
                  rowData.status === "Completed"
                    ? "green"
                    : rowData.status === "In Progress"
                    ? "orange"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {rowData.status}
            </span>
          )}
        />
        <Column
          body={(rowData) => (
            <div className="flex justify-content-center">
              <img
                className="flex justify-content-center cursor-pointer"
                style={{ width: "25px" }}
                src={timesheet}
                onClick={() => viewTimeSheet(rowData)}
              />
            </div>
          )}
          header="Time Sheet"
        />
      </DataTable>

      <Dialog
        visible={dialogVisible}
        onHide={closeDialog}
        header={`Time Sheet`}
        style={{ width: "50vw" }}
      >
        <h4 className="my-0">Name: {selectedEmployeeName}</h4>

        <DataTable value={products} rows={5} responsiveLayout="scroll">
          <Column field="task" header="Task"></Column>
          <Column
            field="time"
            header="Time Spent (hrs)"
            sortable
            footer={`Total: ${totalHours.toFixed(2)} hrs`} // Display total hours in the footer
          ></Column>
        </DataTable>
      </Dialog>
    </>
  );
};

export default TeamAttendanceList;
