import { useState } from "react";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import styles from "./styles.module.css";

export default function CustomPagination({
  entries,
  setEntries,
  totalRecords = 0,
  setTableNav,
  ...rest
}) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(entries);

  const onPageChange = (e) => {
    const { first, rows, page } = e;

    setFirst(first);
    setRows(rows);

    setTableNav(rows * page);
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: () => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
        { label: "All", value: totalRecords },
      ];

      return (
        <>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={rows}
            options={dropdownOptions}
            className={styles.pagination}
            onChange={(e) => {
              const newRows = e.value;
              const newFirst = Math.min(
                first,
                Math.floor(totalRecords / newRows) * newRows
              );
              setEntries(newRows);
              setRows(newRows);
              setFirst(newFirst);

              setTableNav(newRows * Math.floor(newFirst / newRows));
            }}
          />
        </>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  return (
    <Paginator
      template={template2}
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      {...rest}
      className={styles.paginator}
    />
  );
}

import PropTypes from "prop-types";

CustomPagination.proptypes = {
  entries: PropTypes.array.isRequired,
  setEntries: PropTypes.func.isRequired,
  totalRecords: PropTypes.number.isRequired,
  setTableNav: PropTypes.func.isRequired,
};
