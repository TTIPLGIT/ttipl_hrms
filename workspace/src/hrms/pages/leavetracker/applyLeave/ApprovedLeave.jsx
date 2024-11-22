import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { format } from "date-fns";
import { Dialog } from "primereact/dialog";
import InfinityLoader from "../../../../components/loader/Infinity";
import { protectedCall } from "../../../../services/userService";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../../pages/login/loginSlice";

const ApprovedLeave = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const toast = useRef(null);

  const loggedUser = useSelector(selectLoggedUser);
  const loggedEmpId = loggedUser.employeeId;

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const data = await protectedCall(
          `api/leave-request/leave-requests/status?status=approved&employeeId=${loggedEmpId}`
        );
        setSelectedCandidates(data.length > 0 ? data : []);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch approved leaves",
        });
      }
    };

    fetchApprovedLeaves();
  }, [loggedEmpId]);

  const openDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setDialogVisible(true);
  };

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  return (
    <>
      {loader && <InfinityLoader />}
      <div className="px-4" style={{ height: "100vh", overflow: "scroll" }}>
        <Toast ref={toast} />

        <Dialog
          header="Candidate Details"
          visible={isDialogVisible}
          style={{ width: "30vw" }}
          onHide={() => setDialogVisible(false)}
        >
          {selectedCandidate && (
            <div>
              <h3 className="text-green-600">
                {capitalizeFirstLetter(selectedCandidate.status)}
              </h3>
              <p>Leave Type: {selectedCandidate.leaveType}</p>
              <p>
                Duration:{" "}
                {selectedCandidate.startDate && selectedCandidate.startDate && (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCandidates.length === 0 ? (
            <div>No approved leaves found.</div>
          ) : (
            selectedCandidates.map((candidate) => (
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
                  <h3 className="text-lg font-semibold text-green-600">
                    {capitalizeFirstLetter(candidate.status)}
                  </h3>
                </div>
                <div className="flex justify-content-between items-center">
                  {candidate.startDate && candidate.startDate && (
                    <p className="text-sm">
                      {format(new Date(candidate.startDate), "dd MMM yyyy")} -{" "}
                      {format(new Date(candidate.endDate), "dd MMM yyyy")}
                    </p>
                  )}
                  {candidate.date && (
                    <p className="text-sm">
                      {format(new Date(candidate.date), "dd MMM yyyy")}
                    </p>
                  )}

                  <p
                    className="text-green-600"
                    style={{
                      fontSize: "0.875rem",
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovedLeave;
