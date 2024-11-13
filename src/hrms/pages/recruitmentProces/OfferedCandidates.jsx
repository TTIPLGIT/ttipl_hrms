import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import "./recruitment.css";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const OfferedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [declineReason, setDeclineReason] = useState(null); // State for decline reason, now an object or string
  const [isDialogVisible, setDialogVisible] = useState(false); // State for dialog visibility
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Track the selected candidate
  const [displayOfferDialog, setDisplayOfferDialog] = useState(false); // Add this to manage the dialog

  const toast = useRef(null);

  const declineOptions = [
    { label: "Salary is not competitive", value: "salary not competitive" },
    { label: "Better offer elsewhere", value: "better offer elsewhere" },
    { label: "Personal reasons", value: "personal reasons" },
    { label: "Unhappy with role", value: "unhappy with role" },
    { label: "Other", value: "other" },
  ];

  const columns = [
    // { field: "id", header: "ID" },
    { field: "fullName", header: "Name" },
    { field: "applyingFor", header: "Position Applied" },
    { field: "ctc", header: "CTC" },
    { field: "interviewDate", header: "Interview Date" },
    { field: "joiningDate", header: "Joining Date" },
  ];

  const handleDecline = (rowData) => {
    setSelectedCandidate(rowData); // Save the candidate for which the decline reason is being requested
    setDialogVisible(true); // Open the dialog
  };

  const handleViewOffer = async (rowData) => {
    if (!declineReason) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please select reason for decline",
      });
      return;
    }
    try {
      // Create the payload object with the new fields
      const payload = {
        id: rowData.id,
        status: "declined",
        reason: declineReason,
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
        detail: `Offer has been declined to ${rowData.personalEmail}.`,
      });

      // Fetch updated candidate data
      const data = await protectedCall(
        "api/candidate-applications/offered/candidates"
      );

      // Update candidates state
      setSelectedCandidates(data.length > 0 ? data : []);
      // Close the dialog after successful decline
      setDialogVisible(false);
      setDeclineReason(null); // Reset the reason
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setDialogVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={() => handleViewOffer(selectedCandidate)}
        className="p-button-primary"
      />
    </div>
  );

  // Combine firstName and lastName into fullName
  const getFullName = (rowData) => {
    return `${rowData.firstName} ${rowData.lastName}`;
  };

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/offered/candidates"
        );
        setSelectedCandidates(data.length > 0 ? data : []);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err,
        });
      }
    };

    fetchSelectedCandidates();
  }, []);

  const handleViewOfferDialog = (rowData) => {
    setSelectedCandidate(rowData); // Set the selected candidate

    setDisplayOfferDialog(true); // Show the offer dialog
  };

  const dynamicColumns = columns.map((col) => {
    // Add custom rendering for fullName
    if (col.field === "fullName") {
      return <Column key={col.field} header={col.header} body={getFullName} />;
    }
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  dynamicColumns.push(
    <Column
      key="viewOffer"
      header="View offer"
      body={(rowData) => (
        <div className="viewOffer">
          <button
            label="View Offer Letter"
            icon="pi pi-eye"
            className="p-button-success hover:text-white hover:bg-green-600 cursor-pointer  text-base font-medium py-1"
            style={{
              width: "150px",
              backgroundColor: "transparent",
              border: "1px solid #3AA687",
              color: "#3AA687",
              borderRadius: "5px",
            }} // Set the width here
            onClick={() => handleViewOfferDialog(rowData)} // Pass rowData here
          >
            View offer Letter
          </button>
        </div>
      )}
    />,
    <Column
      key="decline"
      header="Decline"
      body={(rowData) => (
        <div className="decline">
          <button
            label="View Offer"
            icon="pi pi-eye"
            className="p-button-success hover:text-white hover:bg-red-600 cursor-pointer  text-base font-medium py-1"
            style={{
              width: "100px",
              backgroundColor: "transparent",
              border: "1px solid #F43F5E",
              color: "#F43F5E",
              borderRadius: "5px",
            }} // Set the width here
            onClick={() => handleDecline(rowData)} // Open dialog on click
          >
            Decline
          </button>
        </div>
      )}
    />
  );

  return (
    <div className="p-4" style={{ height: "100vh", overflow: "scroll" }}>
      <Toast ref={toast} />
      <DataTable value={selectedCandidates} responsiveLayout="scroll">
        {dynamicColumns}
      </DataTable>
      <Dialog
        header="Reason for Decline"
        visible={isDialogVisible}
        style={{ width: "50vw" }}
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        {/* Dropdown for decline reason */}
        <div>
          <span>Reason for declining:</span>
          <Dropdown
            value={declineReason}
            options={declineOptions}
            onChange={(e) => setDeclineReason(e.value)} // Set the selected value
            placeholder="Select a reason"
            style={{ width: "100%" }}
          />
        </div>
      </Dialog>
      {/* Check if selectedCandidate is valid */}
      {selectedCandidate ? (
        <Dialog
          header="Offer Letter"
          visible={displayOfferDialog}
          style={{ width: "80vw" }}
          onHide={() => setDisplayOfferDialog(false)}
        >
          <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <h2>Dear {selectedCandidate.firstName},</h2>
            <p>
              We’re delighted to extend this offer of employment for the
              position of <strong>{selectedCandidate.applyingFor}</strong> with
              our organization. Please review this summary of terms and
              conditions for your anticipated employment with us.
            </p>
            <p>
              If you accept this offer, your start date will be{" "}
              <strong>{selectedCandidate.joiningDate}</strong> or another
              mutually agreed upon date. Please note that this offer will expire
              on <strong>{selectedCandidate.expireDate}</strong>.
            </p>
            <h3>Terms and Conditions</h3>
            <h4>Position</h4>
            <p>
              Your title will be{" "}
              <strong>{selectedCandidate.applyingFor}</strong>. While you are
              employed at this Company, you will not engage in any other
              employment, consulting or other business activity (whether
              full-time or part-time) that would create a conflict of interest
              with the Company. By signing this letter of agreement, you confirm
              that you have no contractual commitments or other legal
              obligations that would prohibit you from performing your duties
              for the Company.
            </p>
            <h4>Cash Compensation</h4>
            <p>
              The Company will pay you a starting salary at the rate of{" "}
              <strong>Rs.{selectedCandidate.ctc} per annum</strong>, payable in
              accordance with the Company’s standard payroll schedule. This
              salary will be subject to adjustment pursuant to the Company’s
              employee compensation policies in effect from time to time.
            </p>
            <h4>Bonus (or Commission) potential</h4>
            <p>
              In addition, you will be eligible to be considered for an
              incentive bonus for each fiscal year of the Company. The bonus (if
              any) will be awarded based on objective or subjective criteria
              established by the Company’s Chief Executive Officer and approved
              by the Company’s Board of Directors. Your target bonus will be
              equal to <strong>20%</strong> of your annual base salary. Any
              bonus for the fiscal year in which your employment begins will be
              prorated, based on the number of days you are employed by the
              Company during that fiscal year. Any bonus for a fiscal year will
              be paid within 2 months after the close of that fiscal year, but
              only if you are still employed by the Company at the time of
              payment. The determinations of the Company’s Board of Directors
              with respect to your bonus will be final and binding.
            </p>
            <h4>Employee Benefits</h4>
            <p>
              As a regular employee of the Company, you will be eligible to
              participate in a number of Company-sponsored benefits. In
              addition, you will be entitled to paid vacation in accordance with
              the Company’s vacation policy.
            </p>
            <h4>Employment Relationship</h4>
            <p>
              Employment with the Company is for no specific period of time.
              Your employment with the Company will be “at will,” meaning that
              either you or the Company may terminate your employment at any
              time and for any reason, with or without cause. Any contrary
              representations that may have been made to you are superseded by
              this letter agreement. This is the full and complete agreement
              between you and the Company on this term. Although your job
              duties, title, compensation and benefits, as well as the Company’s
              personnel policies and procedures, may change from time to time,
              the “at will” nature of your employment may only be changed in an
              express written agreement signed by you and a duly authorized
              officer of the Company (other than you).
            </p>
            <h4>Termination</h4>
            <p>
              The Company reserves the right to terminate employment of any
              employee for just cause at any time without notice and without
              payment in lieu of notice. The Company will be entitled to
              terminate your employment for any reason other than for just
              cause, upon providing to you such minimum notice as required by
              law.
            </p>
            <h4>Proprietary Information and Inventions Agreement</h4>
            <p>
              Like all Company employees, you will be required, as a condition
              of your employment with the Company, to sign the Company’s
              standard Proprietary Information and Inventions Agreement.
            </p>
            <h4>Privacy</h4>
            <p>
              You are required to observe and uphold all of the Company’s
              privacy policies and procedures as implemented or varied from time
              to time. Collection, storage, access to and dissemination of
              employee personal information will be in accordance with privacy
              legislation.
            </p>
            <p>
              You may indicate your agreement with these terms and accept this
              offer by signing and dating this agreement on or before{" "}
              <strong>24-Oct-2024</strong>. Upon your acceptance of this
              employment offer, the Company will provide you with the necessary
              paperwork and instructions.
            </p>
            <p>
              Sincerely,
              <br />
              HR Team
            </p>
            <p>Signatures:</p>
            <div className="flex justify-content-between">
              <div className="">
                <p>
                  _________________________________
                  <br />
                  Company Representative (Sign)
                </p>
                <p>
                  _________________________________
                  <br />
                  Company Representative (Print)
                </p>
                <p>
                  _________________________________
                  <br />
                  Date
                </p>
              </div>
              <div className="">
                <p>
                  _________________________________
                  <br />
                  Applicant (Sign)
                </p>
                <p>
                  _________________________________
                  <br />
                  Applicant (Print)
                </p>
                <p>
                  _________________________________
                  <br />
                  Date
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default OfferedCandidates;
