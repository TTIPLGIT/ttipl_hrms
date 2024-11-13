import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { protectedCall } from "../../../services/userService";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { selectAttendanceId } from "../attendance/attendanceSlice";
import { useNavigate } from "react-router-dom";
import { selectLoggedUser } from "../../../pages/login/loginSlice";

const TaskTracker = () => {
  const loggedUser = useSelector(selectLoggedUser);
  const currentUser = loggedUser.employeeId;

  const navigate = useNavigate();

  const attendanceId = useSelector(selectAttendanceId);

  const toast = useRef(null);

  const [rows, setRows] = useState([{ task: "", time: "" }]);

  const handleAddRow = () => {
    setRows([...rows, { task: "", time: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmitRow = async () => {
    const filledRows = rows.filter((row) => row.task !== "" || row.time !== "");
    const data = {
      ...filledRows,
      emp_id: currentUser,
      attendance_id: attendanceId,
    };
    const updatedData = filledRows.map((item) => ({
      ...item,
      emp_id: data.emp_id,
      attendance_id: data.attendance_id,
    }));

    console.log("updatedData", updatedData);

    try {
      const res = await protectedCall("api/employee-eod", updatedData, "post");
      setRows([{ task: "", time: "" }]);
      setTimeout(() => {
        navigate("/list_task");
      }, 2000);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Task has been updated",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add task",
      });
    }
  };

  return (
    <>
      <div>
        <Toast ref={toast} />

        <div className="bg-white py-4">
          {rows.map((row, index) => (
            <>
              <div
                key={index}
                className="flex justify-content-between w-full p-2"
              >
                <div className=" w-full px-2">
                  <InputText
                    className="w-full"
                    value={row.task}
                    onChange={(e) =>
                      handleInputChange(index, "task", e.target.value)
                    }
                    placeholder="Task"
                  />
                </div>
                <div className="px-2">
                  <InputText
                    value={row.time}
                    onChange={(e) =>
                      handleInputChange(index, "time", e.target.value)
                    }
                    placeholder="Time"
                  />
                </div>
                <div className="p-2">
                  {rows.length > 1 && (
                    <button
                      className="bg-transparent border-none text-sm text-red-200 cursor-pointer hover:text-red-600"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-content-end ">
                {/* Show the "+" button only for the last row, otherwise show the trash icon */}
                {index === rows.length - 1 && (
                  <div className="flex gap-2 flex-row-reverse">
                    <button
                      onClick={handleSubmitRow}
                      className="border-none bg-green-600 text-white hover:bg-white hover:text-green-600 cursor-pointer text-base px-4 py-2 border-round-sm font-bold"
                    >
                      Submit
                    </button>
                    <button
                      className="border-none bg-blue-600 text-white hover:bg-white hover:text-blue-600 cursor-pointer text-base px-4 py-2 border-round-sm font-bold"
                      onClick={handleAddRow}
                    >
                      Add a row
                    </button>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
        {/* <div className="flex justify-content-end">
          <button className="border-none bg-green-600 text-white hover:bg-white hover:text-green-600 cursor-pointer text-base px-4 py-2 border-round-sm font-bold">
            Submit
          </button>
        </div> */}
      </div>
    </>
  );
};

export default TaskTracker;
