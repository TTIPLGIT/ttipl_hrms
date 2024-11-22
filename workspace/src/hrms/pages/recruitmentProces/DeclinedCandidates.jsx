import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import "./recruitment.css";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const DeclinedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const toast = useRef(null);

  const columns = [
    { field: "id", header: "ID" },
    { field: "fullName", header: "Name" },
    { field: "applyingFor", header: "Position Applied" },
    { field: "ctc", header: "CTC" },
    { field: "reason", header: "reason" },
  ];

  // Combine firstName and lastName into fullName
  const getFullName = (rowData) => {
    return `${rowData.firstName} ${rowData.lastName}`;
  };

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/declined/candidates"
        );
        setSelectedCandidates(data.length > 0 ? data : []);
      } catch (err) {
        console.log("Failed to fetch selected candidates");
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err,
        });
      }
    };

    fetchSelectedCandidates();
  }, []); // Removed `error` dependency, as it is not needed
  const dynamicColumns = columns.map((col) => {
    // Add custom rendering for fullName
    if (col.field === "fullName") {
      return <Column key={col.field} header={col.header} body={getFullName} />;
    }
    return <Column key={col.field} field={col.field} header={col.header} />;
  });
  return (
    <div className="px-4" style={{ height: "100vh", overflow: "scroll" }}>
      <Toast ref={toast} />
      <DataTable value={selectedCandidates} responsiveLayout="scroll">
        {dynamicColumns}
      </DataTable>
    </div>
  );
};

export default DeclinedCandidates;
