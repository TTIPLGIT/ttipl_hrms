import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { format, parseISO } from "date-fns"; // Use parseISO to handle ISO date strings
import { protectedCall } from "../../../services/userService";
import "./recruitment.css";

const RejectedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toast = useRef(null); // Reference for Toast component
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/rejected/candidates"
        );
        setSelectedCandidates(data.length > 0 ? data : []);
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
  }, [error]);

  const openSidebar = (candidate) => {
    setSelectedCandidate(candidate);
    setSidebarVisible(true);
  };

  const handleOfferBtn = async () => {
    try {
      // Create the payload object conditionally
      const payload = {
        id: selectedCandidate.id,
        status: "selected",
        ...(comment?.length ? { comment: comment } : {}), // Add comment if it exists
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
        "api/candidate-applications/rejected/candidates"
      );

      // Update candidates state
      setSelectedCandidates(data.length > 0 ? data : []);
      setSidebarVisible(false);
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  };

  return (
    <div className="px-4" style={{ height: "100vh", overflow: "scroll" }}>
      <Toast ref={toast} />

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
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
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
          </>
        )}
      </Sidebar>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCandidates.map((candidate) => (
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
              <h3 className="text-lg font-semibold">{candidate.firstName}</h3>
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
  );
};

export default RejectedCandidates;
