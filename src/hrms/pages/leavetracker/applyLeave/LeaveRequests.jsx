import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { format } from "date-fns";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import InfinityLoader from "../../../../components/loader/Infinity";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../../pages/login/loginSlice";
import { protectedCall } from "../../../../services/userService";

const LeaveRequests = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [groupedCandidates, setGroupedCandidates] = useState({});
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const toast = useRef(null);
  const [loader, setLoader] = useState(false);

  const loggedUser = useSelector(selectLoggedUser);
  const loggedEmpId = loggedUser.employeeId;

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const data = await protectedCall(`api/leave-request/status/pending`);
        setSelectedCandidates(data.length > 0 ? data : []);
        groupLeaveRequests(data);
      } catch (err) {
        setError("Failed to fetch selected candidates");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error,
        });
      }
    };

    fetchSelectedCandidates();
  }, [error, loggedEmpId]);

  const groupLeaveRequests = (data) => {
    const grouped = data.reduce((acc, candidate) => {
      const date = format(new Date(candidate.createdOn), "dd MMM yyyy");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(candidate);
      return acc;
    }, {});
    setGroupedCandidates(grouped);
  };

  const openDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setDialogVisible(true);
  };

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  const approveLeave = async () => {
    if (selectedCandidate) {
      setLoader(true);
      const payload = { id: selectedCandidate.id, status: "approved" };

      try {
        await protectedCall("api/leave-request/update-status", payload, "post");
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Leave approved for ${selectedCandidate.employee.firstName}`,
        });
        setDialogVisible(false);
        const data = await protectedCall("api/leave-request/status/pending");
        setSelectedCandidates(data.length > 0 ? data : []);
        groupLeaveRequests(data);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Approval Error",
          detail: "Failed to approve leave. Please try again.",
        });
      } finally {
        setLoader(false);
      }
    }
  };

  const rejectLeave = async () => {
    if (selectedCandidate) {
      setLoader(true);
      const payload = { id: selectedCandidate.id, status: "rejected" };

      try {
        await protectedCall("api/leave-request/update-status", payload, "post");
        toast.current.show({
          severity: "warn",
          summary: "Rejected",
          detail: `Leave rejected for ${selectedCandidate.employee.firstName}`,
        });
        const data = await protectedCall("api/leave-request/status/pending");
        setSelectedCandidates(data.length > 0 ? data : []);
        groupLeaveRequests(data);
        setDialogVisible(false);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Rejection Error",
          detail: "Failed to reject leave. Please try again.",
        });
      } finally {
        setLoader(false);
      }
    }
  };

  const confirmApprove = () => {
    confirmDialog({
      message: "Are you sure you want to approve this leave?",
      header: "Confirmation",
      icon: "pi pi-check",
      acceptClassName: "p-button-success",
      accept: approveLeave,
    });
  };

  const confirmReject = () => {
    confirmDialog({
      message: "Are you sure you want to reject this leave?",
      header: "Confirmation",
      icon: "pi pi-times",
      acceptClassName: "p-button-danger",
      accept: rejectLeave,
    });
  };

  return (
    <>
      {loader && <InfinityLoader />}
      <div className="px-4" style={{ height: "100vh", overflow: "scroll" }}>
        <Toast ref={toast} />
        <ConfirmDialog />
        <Dialog
          header="Candidate Details"
          visible={isDialogVisible}
          style={{ width: "30vw" }}
          onHide={() => setDialogVisible(false)}
          footer={
            <div>
              <button
                className=" border-none bg-green-600 text-white p-2 font-semibold cursor-pointer hover:text-green-600 hover:border-green-600 hover:bg-white "
                style={{ borderRadius: "5px" }}
                onClick={confirmApprove}
              >
                Approve
              </button>
              <button
                className="border-none bg-red-600 text-white p-2 font-semibold cursor-pointer hover:text-red-600 hover:border-red-600 hover:bg-white"
                style={{ borderRadius: "5px" }}
                onClick={confirmReject}
              >
                Reject
              </button>
            </div>
          }
        >
          {selectedCandidate && (
            <div>
              <h3 className="text-gray-800">
                Name:{" "}
                {capitalizeFirstLetter(selectedCandidate.employee.firstName)}
              </h3>
              <h3 className="text-orange-600">
                {capitalizeFirstLetter(selectedCandidate.status)}
              </h3>
              <p>Leave Type: {selectedCandidate.leaveType}</p>
              <p>
                Duration:{" "}
                {selectedCandidate.startDate && selectedCandidate.endDate && (
                  <p className="text-sm">
                    {format(
                      new Date(selectedCandidate.startDate),
                      "dd MMM yyyy"
                    )}{" "}
                    -{" "}
                    {format(new Date(selectedCandidate.endDate), "dd MMM yyyy")}
                  </p>
                )}
                {selectedCandidate.date && (
                  <p className="text-sm">
                    {format(new Date(selectedCandidate.date), "dd MMM yyyy")}
                  </p>
                )}
              </p>
              <p>Type: {selectedCandidate.type}</p>
              <p>Applied Leave For: {selectedCandidate.appliedLeaveCount}</p>
            </div>
          )}
        </Dialog>
        <Divider />
        <div className="">
          {Object.keys(groupedCandidates).length === 0 ? (
            <div>No Leave Requested candidate found.</div>
          ) : (
            Object.keys(groupedCandidates).map((date) => (
              <div key={date} className="mb-4">
                <h4 className="text-lg font-semibold">{date}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedCandidates[date].map((candidate) => (
                    <div
                      key={candidate.id}
                      className="w-3 bg-white px-4 py-2 cursor-pointer"
                      style={{
                        height: "150px",
                        borderRadius: "10px",
                        boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onClick={() => openDialog(candidate)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold">
                          {capitalizeFirstLetter(candidate.employee.firstName)}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        {candidate.startDate && candidate.startDate && (
                          <p className="text-sm">
                            {format(
                              new Date(candidate.startDate),
                              "dd MMM yyyy"
                            )}{" "}
                            -{" "}
                            {format(new Date(candidate.endDate), "dd MMM yyyy")}
                          </p>
                        )}
                        {candidate.date && (
                          <p className="text-sm">
                            {format(new Date(candidate.date), "dd MMM yyyy")}
                          </p>
                        )}

                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "green",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "150px",
                          }}
                        >
                          {candidate.leaveType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveRequests;
