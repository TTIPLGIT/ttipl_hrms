import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { camelCaseToSpaces, capitalize, sliceArray } from "../../utils/helper";
import CustomPagnation from "../pagination/pagination";

import Button from "../button/Button";
import Search from "../search/CustomSearch";

import CustomCheckBox from "../form/checkBox/CheckBox";

import PropTypes from "prop-types";

import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import ActionMenu from "../actionMenu/ActionMenu";

export default function Table({
  size = "large",
  products,
  actions,
  head,
  addBtnAction,
  addBtnName = "Add",
  tableStyle = {},
  tableName = "Table Name",
  btnStyle = {},
  btnWrapperStyle = {},
  tableHeaderStyle = {},
  paginationStyle = {},
  tableBodyStyle = {},
  btnClassName = "",
  btnWrapperClassName = "",
  tableHeaderClassName = "",
  paginationClassName = "",
  tableBodyClassName = "",
  isMenuOpen,
  setMenuOpen,
  setRow,
  isAddNeeded = true,
  defaultFilter = [],
  isActionNeeded = true,
}) {
  const [entries, setEntries] = useState(5);
  const [anchorPosition, setAnchorPosition] = useState({
    top: 0,
    left: 0,
  });

  const modalRef = useRef();

  const [isiconsOpen, setIconsOpen] = useState({
    search: false,
    filter: false,
  });

  const filtered = Object.keys(products.length ? products[0] : []);

  const { register, watch, setValue } = useForm();

  useEffect(() => {
    if (!watch("colFilter")) setValue("colFilter", defaultFilter);
  }, [setValue, defaultFilter, watch]);

  const handleClick = useMemo(
    () => (event) => {
      const { top, left } = event.target.getBoundingClientRect();
      setAnchorPosition({ top: top + 20, left: left - 200 });
      setMenuOpen(true);
    },
    [setMenuOpen]
  );

  const productsWithAction = useMemo(() => {
    return products.map((elem) => ({
      ...elem,

      action: (
        <i
          className="pi pi-ellipsis-v px-6 py-3 cursor-pointer"
          onClick={(e) => {
            handleClick(e);
            setRow(elem);
          }}
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "white",
          }}
        />
      ),
    }));
  }, [products, setRow, handleClick]);

  const [search, setSearch] = useState("");
  const [tableNav, setTableNav] = useState(0);
  const [searchResult, setSearchResult] = useState(productsWithAction || []);
  const [totalRecords, setTotalRecords] = useState(products.length);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSearch = useCallback(() => {
    const product = productsWithAction.filter((obj) =>
      head.some((str) => {
        const value = obj[str];
        return (
          value && String(value).toLowerCase().includes(search.toLowerCase())
        );
      })
    );
    setSearchResult(sliceArray(product, tableNav, tableNav + entries));
    setTotalRecords(product.length);
  }, [entries, productsWithAction, head, search, tableNav]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <>
      {/* <div
        className={`${styles.AddBtn} ${btnWrapperStyle}`}
        style={{
          backgroundColor: tableStyle?.addBtn?.wrapperBg,
          border: tableStyle?.addBtn?.wrapperBorder,
          borderRadius: tableStyle?.addBtn?.wrapperBorderRadius,
          ...btnWrapperClassName,
        }}
      >
        <Button
          icon="pi pi-plus"
          name={addBtnName}
          onClick={() => {
            addBtnAction();
          }}
          style={{
            backgroundColor: tableStyle?.addBtn?.btnBg,
            color: tableStyle?.addBtn?.btnText,
            fontSize: tableStyle?.addBtn?.btnFontSize,
            fontWeight: tableStyle?.addBtn?.btnFontWeight,
            border: tableStyle?.addBtn?.btnBorder,
            borderRadius: tableStyle?.addBtn?.btnBorderRadius,
            ...btnStyle,
          }}
          className={btnClassName}
        />
      </div> */}

      <div className={styles.table}>
        <div
          className={`${styles.headingWapper} ${tableHeaderClassName}`}
          style={{
            backgroundColor: tableStyle?.tableHeader?.bg,
            color: tableStyle?.tableHeader?.text,
            fontSize: tableStyle?.tableHeader?.fontSize,
            fontWeight: tableStyle?.tableHeader?.fontWeight,
            ...tableHeaderStyle,
          }}
        >
          {isiconsOpen.search ? (
            <div className={styles.searchWrapper}>
              <Search
                className={styles.search}
                placeholder="Search.."
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}
              />
            </div>
          ) : (
            <h2 className="bg-transparent">{tableName}</h2>
          )}
          <div className={styles.iconWrapper}>
            <i
              className={`${styles.icon} pi ${
                isiconsOpen.search ? "pi-times" : "pi-search"
              }`}
              style={{
                border: tableStyle?.tableHeader?.iconBorder,
                fontSize: tableStyle?.tableHeader?.fontSize,
                fontWeight: tableStyle?.tableHeader?.fontWeight,
              }}
              onClick={() =>
                setIconsOpen({
                  filter: false,
                  search: !isiconsOpen.search,
                })
              }
            />
            <div style={{ position: "relative" }}>
              <i
                className={`${styles.icon} pi ${
                  isiconsOpen.filter ? "pi-times" : "pi-eye"
                }`}
                style={{
                  border: tableStyle?.tableHeader?.iconBorder,
                  fontSize: tableStyle?.tableHeader?.fontSize,
                  fontWeight: tableStyle?.tableHeader?.fontWeight,
                }}
                onClick={() =>
                  setIconsOpen({
                    search: false,

                    filter: !isiconsOpen.filter,
                  })
                }
              />
              {isiconsOpen.filter && (
                <div className={styles.columnFilter}>
                  <CustomCheckBox
                    id="colFilter"
                    name="colFilter"
                    labelText="Column Filter"
                    checkBoxList={filtered}
                    register={register}
                    wrapperClass={styles.checkBox}
                  />
                </div>
              )}
            </div>
            {isAddNeeded && (
              <div style={{}}>
                <i
                  className={`${styles.icon} font-bold bg-blue-500 text-white pi pi-plus `}
                  style={{
                    border: tableStyle?.tableHeader?.iconBorder,
                    fontSize: tableStyle?.tableHeader?.fontSize,
                    fontWeight: tableStyle?.tableHeader?.fontWeight,
                  }}
                  onClick={() => {
                    addBtnAction();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <DataTable
            value={searchResult}
            removableSort
            size={size}
            tableStyle={{
              minWidth: "50rem",
            }}
            scrollable
            scrollHeight="400px"
          >
            {head.map((elem) => {
              const newDT = watch("colFilter") || [];

              if (elem === "action" && isActionNeeded) {
                return (
                  <Column
                    key={elem}
                    field={elem}
                    header={capitalize(camelCaseToSpaces(elem))}
                    sortable
                    style={{
                      color: tableStyle?.tableBody?.text,
                      backgroundColor: tableStyle?.tableBody?.bg,
                      fontSize: tableStyle?.tableBody?.fontSize,
                      fontWeight: tableStyle?.tableBody?.fontWeight,
                      ...tableBodyStyle,
                      position: "sticky",
                      right: 0,
                    }}
                    className={tableBodyClassName}
                  ></Column>
                );
              } else if (
                !newDT?.includes(elem) ||
                (elem === "action" && isActionNeeded)
              ) {
                return (
                  <Column
                    key={elem}
                    field={elem}
                    header={capitalize(camelCaseToSpaces(elem))}
                    sortable
                    style={{
                      color: tableStyle?.tableBody?.text,
                      backgroundColor: tableStyle?.tableBody?.bg,
                      fontSize: tableStyle?.tableBody?.fontSize,
                      fontWeight: tableStyle?.tableBody?.fontWeight,
                      ...tableBodyStyle,
                    }}
                    className={tableBodyClassName}
                  ></Column>
                );
              }
            })}
          </DataTable>
        </div>

        <CustomPagnation
          entries={entries}
          setEntries={setEntries}
          totalRecords={totalRecords}
          setTableNav={setTableNav}
          style={{
            justifyContent: tableStyle?.pagination?.alignment,
            fontSize: tableStyle?.pagination?.fontSize,
            fontWeight: tableStyle?.pagination?.fontWeight,
            backgroundColor: tableStyle?.pagination?.bg,
            ...paginationStyle,
          }}
          className={paginationClassName}
        />
      </div>
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: anchorPosition.top,
            left: anchorPosition.left,
            zIndex: "100",
          }}
          ref={modalRef}
        >
          <ActionMenu items={actions} />
        </div>
      )}
    </>
  );
}

Table.propTypes = {
  size: PropTypes.string,
  products: PropTypes.array.isRequired,
  actions: PropTypes.array,
  head: PropTypes.array.isRequired,
  addBtnAction: PropTypes.func,
  tableStyle: PropTypes.objectOf(PropTypes.object),
  tableName: PropTypes.string.isRequired,
  btnStyle: PropTypes.object,
  btnWrapperStyle: PropTypes.object,
  tableHeaderStyle: PropTypes.object,
  paginationStyle: PropTypes.object,
  tableBodyStyle: PropTypes.object,
  btnClassName: PropTypes.string,
  btnWrapperClassName: PropTypes.string,
  tableHeaderClassName: PropTypes.string,
  paginationClassName: PropTypes.string,
  tableBodyClassName: PropTypes.string,
  defaultFilter: PropTypes.arrayOf(PropTypes.string),
};
