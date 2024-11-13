import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { format, parseISO } from "date-fns"; // Use parseISO to handle ISO date strings
import { protectedCall } from "../../../services/userService";
import { Dialog } from "primereact/dialog"; // Import Dialog for popup
import { Calendar } from "primereact/calendar"; // Import Calendar for date input
import "./recruitment.css";
import InfinityLoader from "../../../components/loader/Infinity";

const SelectedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false); // State for Dialog visibility
  const toast = useRef(null); // Reference for Toast component
  const [comment, setComment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState(null); // New state for date of joining
  const [offerExpiryDate, setOfferExpiryDate] = useState(null); // New state for offer expiry date
  const [ctc, setCtc] = useState(""); // New state for CTC
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/selected/candidates"
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

  const handleOfferBtn = () => {
    setDialogVisible(true); // Show dialog when clicking "Send offer letter"
  };

  const handleSubmitOffer = async () => {
    // Validation checks
    if (!dateOfJoining) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please select a date of joining.",
      });
      return;
    }

    if (!offerExpiryDate) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please select an offer expiry date.",
      });
      return;
    }

    if (dateOfJoining && offerExpiryDate && offerExpiryDate < dateOfJoining) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Offer expiry date must be after the date of joining.",
      });
      return;
    }

    if (!ctc || isNaN(ctc) || parseFloat(ctc) <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please enter a valid CTC amount.",
      });
      return;
    }
    setLoader(true);

    try {
      // Create the payload object with the new fields
      const payload = {
        id: selectedCandidate.id,
        status: "offered",
        ...(comment?.length ? { comments: comment } : {}),
        joiningDate: dateOfJoining ? format(dateOfJoining, "yyyy-MM-dd") : null,
        expireDate: offerExpiryDate
          ? format(offerExpiryDate, "yyyy-MM-dd")
          : null,
        ctc: ctc,
      };

      console.log("payload", payload);

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
        detail: `Offer letter has been sent to ${selectedCandidate.personalEmail}.`,
      });

      // Fetch updated candidate data
      const data = await protectedCall(
        "api/candidate-applications/selected/candidates"
      );

      // Update candidates state
      setSelectedCandidates(data.length > 0 ? data : []);
      setSidebarVisible(false);
      setDialogVisible(false); // Hide the dialog
    } catch (error) {
      console.log("error");
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <InfinityLoader />}
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
              {/* <div className="flex justify-content-between">
              <p>Selected Details</p>
              <p>
                <i className="pi pi-plus cursor-pointer"></i>
              </p>
            </div> */}
              {/* <Divider /> */}
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
                  onClick={handleOfferBtn} // Trigger the dialog
                >
                  Send offer letter
                </button>
              </div>
            </>
          )}
        </Sidebar>

        {/* Dialog for adding offer details */}
        <Dialog
          header="Offer Details"
          visible={isDialogVisible}
          style={{ width: "30vw" }}
          onHide={() => setDialogVisible(false)} // Hide dialog on close
          footer={
            <div>
              <button
                className="btn bg-green-500 px-4 py-1"
                onClick={handleSubmitOffer} // Submit offer with details
              >
                {loader ? (
                  <>
                    <span className="loader mr-2"></span> Submitting...
                  </>
                ) : (
                  "Submit"
                )}{" "}
              </button>
            </div>
          }
        >
          <div className="field">
            <p className="my-1 text-sm font-medium">Date of Joining:</p>
            <Calendar
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.value)} // Update date of joining state
              dateFormat="dd/mm/yy"
              placeholder="Select date of joining"
              showIcon
              className="w-8"
              required
            />
          </div>
          <div className="field ">
            <p className="my-1 text-sm font-medium">Offer Expiry Date:</p>
            <Calendar
              value={offerExpiryDate}
              onChange={(e) => setOfferExpiryDate(e.value)} // Update offer expiry date state
              dateFormat="dd/mm/yy"
              placeholder="Select offer expiry date"
              className="w-8"
              required
              showIcon
            />
          </div>
          <div className="field">
            <p className="my-1 text-sm font-medium">CTC:</p>
            <input
              type="text"
              className="w-full  p-2 rounded"
              style={{
                border: "1px solid", // Adding 'solid' for the border style
                borderColor: "#D1D5DB", // Equivalent of Tailwind's gray-300
                borderRadius: "5px",
              }}
              value={ctc}
              onChange={(e) => setCtc(e.target.value)} // Update CTC state
              required
              placeholder="Enter CTC amount"
            />
          </div>
        </Dialog>

        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCandidates.length === 0 ? (
            <div>No selected candidate found.</div>
          ) : (
            selectedCandidates.map((candidate) => (
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SelectedCandidates;
