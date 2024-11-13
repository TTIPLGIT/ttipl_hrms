import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { format, parseISO } from "date-fns"; // Use parseISO to handle ISO date strings
import { protectedCall } from "../../../services/userService";
import "./recruitment.css";
import InfinityLoader from "../../../components/loader/Infinity";

const InterviewScheduledCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toast = useRef(null); // Reference for Toast component
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchScheduledCandidates = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/scheduled/candidates"
        );
        setCandidates(data.length > 0 ? data : []);
      } catch (err) {
        setError("Failed to fetch scheduled candidates");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error,
        });
      }
    };

    fetchScheduledCandidates();
  }, [error]);

  // Group candidates by interview date
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    const date = candidate.interviewDate; // Assuming interviewDate is in 'YYYY-MM-DD' format
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(candidate);
    return acc;
  }, {});

  // Sort the dates in ascending order
  const sortedDates = Object.keys(groupedCandidates).sort((a, b) => {
    return parseISO(a) - parseISO(b); // Compare dates using parseISO
  });

  const openSidebar = (candidate) => {
    setSelectedCandidate(candidate);
    setSidebarVisible(true);
  };

  const handleSelectBtn = async () => {
    setLoader(true);

    try {
      // Create the payload object conditionally
      const payload = {
        id: selectedCandidate.id,
        status: "selected",
        ...(comment?.length ? { comments: comment } : {}), // Add comment if it exists
      };

      // Make the API call
      const dataUpdate = await protectedCall(
        "api/candidate-applications/update-status",
        payload, // Use the constructed payload
        "post"
      );

      // Show success toast notification
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: `${selectedCandidate.firstName} selected.`,
      });

      // Fetch updated candidate data
      const data = await protectedCall(
        "api/candidate-applications/scheduled/candidates"
      );

      // Update candidates state
      setCandidates(data.length > 0 ? data : []);
      setSidebarVisible(false);
    } catch (error) {
      console.log("error");
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleRejectBtn = async () => {
    setLoader(true);

    try {
      // Create the payload object conditionally
      const payload = {
        id: selectedCandidate.id,
        status: "rejected",
        ...(comment?.length ? { comments: comment } : {}),
      };

      // Make the API call
      const dataUpdate = await protectedCall(
        "api/candidate-applications/update-status",
        payload, // Use the constructed payload
        "post"
      );

      // Show success toast notification
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: `${selectedCandidate.firstName} rejected.`,
      });

      // Fetch updated candidate data
      const data = await protectedCall(
        "api/candidate-applications/scheduled/candidates"
      );

      // Update candidates state
      setCandidates(data.length > 0 ? data : []);
      setSidebarVisible(false);
    } catch (error) {
      console.log("error");
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="p-4" style={{ height: "100vh", overflow: "scroll" }}>
        {loader && <InfinityLoader />}

        {/* Sidebar for showing candidate details */}
        <Sidebar
          visible={isSidebarVisible}
          onHide={() => setSidebarVisible(false)}
          position="right"
          style={{ width: "50%" }}
        >
          <p className="text-lg">Overview</p>
          <Divider />
          {selectedCandidate && (
            <>
              <div className="table-container">
                <table className="table">
                  <tbody>
                    <tr className="table-row">
                      <td className="table-cell">Name</td>
                      <td className="table-value">
                        {selectedCandidate.firstName}{" "}
                        {selectedCandidate.lastName}
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">Email</td>
                      <td className="table-value">
                        {selectedCandidate.personalEmail}
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">Mobile</td>
                      <td className="table-value">
                        {selectedCandidate.mobileNumber}
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">Interview Date</td>
                      <td className="table-value">
                        {format(
                          parseISO(selectedCandidate.interviewDate),
                          "dd MMM yyyy"
                        )}
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">Position Applied</td>
                      <td className="table-value">
                        {selectedCandidate.applyingFor}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Divider />
              <div className="">
                <p>Add comment</p>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 p-2 rounded"
                  onChange={(e) => setComment(e.target.value)} // Update state on input change
                />
              </div>

              {/* Container for buttons */}
              <div className="pt-4 flex justify-end items-end">
                <button
                  className="btn bg-green-500 px-4 py-1 mr-2"
                  onClick={handleSelectBtn}
                >
                  Select
                </button>
                <button
                  className="btn bg-red-500 px-4 py-1"
                  onClick={handleRejectBtn}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </Sidebar>

        {sortedDates.length === 0 ? (
          <div>No scheduled interviews found.</div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="mb-4">
              <h2 className="text-lg font-semibold mb-2">
                {format(parseISO(date), "dd MMM yyyy")} {/* Format date */}
              </h2>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCandidates[date].map((candidate) => (
                  <div
                    key={candidate.id}
                    className="w-3 bg-white px-4 py-2 cursor-pointer"
                    style={{
                      height: "150px",
                      borderRadius: "10px",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.1)", // Optional: Add shadow for better visual
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    onClick={() => openSidebar(candidate)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {candidate.firstName}
                      </h3>
                    </div>
                    <div className="flex justify-content-between items-center">
                      <p className="text-sm">{candidate.mobileNumber}</p>
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
                        {candidate.personalEmail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default InterviewScheduledCandidates;
