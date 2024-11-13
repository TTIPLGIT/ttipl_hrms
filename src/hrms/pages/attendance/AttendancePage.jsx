import { useRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar"; // For DatePicker
import { protectedCall } from "../../../services/userService";
import "./attendance.css";
import { useDispatch, useSelector } from "react-redux";
import { setAttendanceId, setStatus } from "./attendanceSlice";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { selectLoggedUser } from "../../../pages/login/loginSlice";

const AttendancePage = () => {
  const toast = useRef(null); // For Toast notifications
  const calendarRef = useRef(null); // For Calendar component to detect outside click
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [attendanceData, setAttendanceData] = useState([]); // Stores attendance data for the employee
  const [checkButton, setCheckButton] = useState("Check-In"); // Button text toggling between 'Check-In' and 'Check-Out'
  const [currentAttendance, setCurrentAttendance] = useState(null); // Tracks current attendance data for the logged-in user
  const [weekData, setWeekData] = useState([]); // Holds the dates for all 7 days of the current week
  const [selectedDate, setSelectedDate] = useState(new Date()); // The selected date in the date picker
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [time, setTime] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(null);
  const [checkIned, setCheckIn] = useState(new Date()); // Example check-in time
  const [plainText, setPlainText] = useState(""); // Plain text state
  const [showEod, setEod] = useState(false);

  const loggedUser = useSelector(selectLoggedUser);
  const currentUser = loggedUser.employeeId;

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

  useEffect(() => {
    const generateWeekDays = (date) => {
      const days = [];
      const currentDay = date.getDay();

      const startOfWeek = date.getDate() - currentDay;
      for (let i = 0; i < 7; i++) {
        const day = new Date(date);
        day.setDate(startOfWeek + i);
        days.push(day);
      }
      return days;
    };

    const fetchAttendanceData = async () => {
      try {
        const data = await protectedCall(`api/Attendance/${currentUser}`);
        setAttendanceData(data.length > 0 ? data : []);

        const week = generateWeekDays(selectedDate);
        setWeekData(week);

        const todayAttendance = data.find(
          (attendance) =>
            attendance.emp_id === currentUser &&
            new Date(attendance.check_in_time).toDateString() ===
              new Date().toDateString()
        );

        setCurrentAttendance(todayAttendance);

        setCheckButton(
          todayAttendance && !todayAttendance.check_out_time
            ? "Check-Out"
            : "Check-In"
        );
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.message || "Failed to load attendance data.",
        });
      }
    };

    fetchAttendanceData();
  }, [selectedDate, currentUser]);

  const columns = [
    { field: "date", header: "Date" },
    { field: "checkIn", header: "Check-In" },
    { field: "checkOut", header: "Check-Out" },
    { field: "totalHrs", header: "Total Hours" },
    { field: "payableHrs", header: "Payable Hours" },
  ];

  const formattedData = weekData.map((weekDay) => {
    const checkInAttendance = attendanceData.find(
      (attendance) =>
        new Date(attendance.check_in_time).toLocaleDateString() ===
        weekDay.toLocaleDateString()
    );

    const checkInTime = checkInAttendance?.check_in_time
      ? new Date(checkInAttendance.check_in_time)
      : null;

    const checkOutTime = checkInAttendance?.check_out_time
      ? new Date(checkInAttendance.check_out_time)
      : null;

    const totalHrs =
      checkInTime && checkOutTime
        ? Math.round((checkOutTime - checkInTime) / 3600000)
        : 0;

    return {
      date: weekDay.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      checkIn: checkInTime ? checkInTime.toLocaleTimeString() : "-",
      checkOut: checkOutTime ? checkOutTime.toLocaleTimeString() : "-",
      totalHrs: totalHrs.toFixed(2),
      payableHrs: totalHrs.toFixed(2),
      status: checkInTime
        ? checkOutTime
          ? "Completed"
          : "In Progress"
        : "Absent",
      isToday: weekDay.toLocaleDateString() === new Date().toLocaleDateString(),
    };
  });

  const dynamicColumns = columns.map((col) => (
    <Column key={col.field} field={col.field} header={col.header} />
  ));

  const handleCheckIn = async () => {
    const currentDateTime = new Date().toISOString();
    const payload = {
      emp_id: currentUser,
      check_in_time: currentDateTime,
    };

    try {
      const res = await protectedCall("api/attendance", payload, "post");
      const attendanceId = res.id;
      dispatch(setAttendanceId(attendanceId));
      dispatch(setStatus("active"));
      const data = await protectedCall(`api/attendance/${currentUser}`);
      setAttendanceData(data.length > 0 ? data : []);
      setCurrentAttendance({
        ...currentAttendance,
        check_in_time: currentDateTime,
      });
      setCheckIn(currentDateTime);
      setCheckButton("Check-Out");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to check in. Please try again.",
      });
    }
  };

  const handleCheckOut = () => {
    const checkInTime = new Date(currentAttendance.check_in_time);
    const currentTime = new Date();

    const hoursWorked = Math.round((currentTime - checkInTime) / 3600000);

    setHoursWorked(hoursWorked);

    setVisible(true);
  };

  const CheckOut = async () => {
    const currentDateTime = new Date().toISOString();
    const payload = {
      emp_id: currentUser,
      check_out_time: time ? time : currentDateTime,
    };

    try {
      const res = await protectedCall("api/attendance", payload, "post");
      const data = await protectedCall(`api/attendance/${currentUser}`);
      dispatch(setAttendanceId(res.id));

      setAttendanceData(data.length > 0 ? data : []);
      setCurrentAttendance({
        ...currentAttendance,
        check_out_time: currentDateTime,
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "You have been checked out",
        life: 3000,
      });
      dispatch(setStatus("offline"));
      setVisible(false);
      setCheckButton("Check-In");
      setTimeout(() => {
        navigate("/list_task/add");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to check out. Please try again.",
      });
    }
  };

  const isButtonDisabled =
    !!currentAttendance?.check_out_time && !!currentAttendance?.check_in_time;

  const formatDateRange = () => {
    const startOfWeek = new Date(weekData[0]);
    const endOfWeek = new Date(weekData[weekData.length - 1]);

    const options = { day: "numeric", month: "short", year: "numeric" };

    return `${startOfWeek.toLocaleDateString(
      "en-GB",
      options
    )} - ${endOfWeek.toLocaleDateString("en-GB", options)}`;
  };

  const handleSetToday = () => {
    setSelectedDate(new Date());
  };

  const getTimeDifference = () => {
    if (!checkIned || !time) return null;

    const diffMilliseconds = Math.abs(checkIned - time);
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    return `${diffHours} hours and ${remainingMinutes} minutes`;
  };
  useEffect(() => {
    const plain = value.replace(/<[^>]+>/g, ""); // Strip HTML tags
    setPlainText(plain); // Update the plain text state
  }, [value]);

  return (
    <div className="px-4 bg-white">
      <Toast ref={toast} />
      <div className="flex justify-content-between py-4 ">
        {/* Button to set the current date */}
        <p
          onClick={handleSetToday}
          className="bg-blue-600 text-white px-4 py-2 border-none font-bold cursor-pointer text-base border-round-sm hover:bg-blue-500"
        >
          Today
        </p>
        <div className="flex align-items-center justify-content-center">
          <div
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.setDate(selectedDate.getDate() - 7))
              )
            }
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
            onClick={
              () =>
                setSelectedDate(
                  new Date(selectedDate.setDate(selectedDate.getDate() + 7))
                ) // Go to the next week
            }
            className="text-blue-600 font-bold cursor-pointer mx-2"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>

          {/* Display Date Range */}
          <div className="text-sm font-bold ml-3">{formatDateRange()}</div>
        </div>

        <p
          onClick={
            !isButtonDisabled
              ? currentAttendance
                ? handleCheckOut
                : handleCheckIn
              : null
          }
          className={`${
            checkButton === "Check-Out"
              ? "bg-red-600 hover:text-red-600"
              : "bg-green-600 hover:text-green-600"
          } text-white px-4 py-2 font-bold cursor-pointer text-base border-round-sm 
     ${
       isButtonDisabled
         ? "hover:bg-black cursor-none opacity-50"
         : "hover:bg-white "
     }`}
        >
          {checkButton}
        </p>
      </div>

      {/* Data Table */}
      <DataTable value={formattedData} responsiveLayout="scroll">
        {dynamicColumns}
      </DataTable>

      <Dialog
        header="Header"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <p>Total hours worked: {hoursWorked} hrs</p>
        <div>
          <p>Want to change the Working hour?</p>
          <Calendar
            value={time}
            onChange={(e) => setTime(e.value)}
            timeOnly
            showIcon
            showButtonBar
          />
        </div>
        {time && (
          <p className="text-base ">
            Selected Time: {time.toLocaleTimeString()}
          </p>
        )}
        {time && (
          <p className="text-base ">
            Updated total hours worked:{" "}
            <span className="font-bold text-blue-600">
              {getTimeDifference()}
            </span>
          </p>
        )}

        {!showEod && (
          <div className="flex justify-content-end">
            <button
              onClick={() => CheckOut()}
              className="  border-none bg-red-600 text-white hover:bg-white hover:text-red-600 cursor-pointer text-base px-4 py-2 border-round-sm font-bold"
            >
              Check-out
            </button>
          </div>
        )}
        {showEod && (
          <>
            <Divider />
            <div>
              <p className="flex justify-content-center text-xl font-bold">
                Update E.O.D
              </p>
              <div>
                <label>Task</label>
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={setValue}
                />{" "}
              </div>
              <div className="flex justify-content-end gap-2 p-2">
                <button className="border-none bg-green-600 text-white hover:bg-white hover:text-green-600 cursor-pointer text-base px-4 py-2 border-round-sm font-bold">
                  Submit & Check-out
                </button>
              </div>{" "}
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default AttendancePage;
