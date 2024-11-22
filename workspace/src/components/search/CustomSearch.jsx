import styles from "./styles.module.css";

import PropTypes from "prop-types";

const searchStyle = {
  backgroundColor: "rgba(255,255,255,0.2)",
  border: "none",
  padding: "10px 10px 10px 40px",
  width: "100%",
  color: "",
  borderRadius: "5px",
};
function Search({
  className,
  style,
  placeholder,
  searchStyleAsProp,
  search,
  setSearch,
  iconClassName,
}) {
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div
      className={styles.searchWrapper}
      style={{ width: searchStyleAsProp?.width || searchStyle.width }}
    >
      <input
        name="search"
        id="search"
        placeholder={placeholder || "Search..."}
        value={search}
        onChange={handleChange}
        className={`${styles.search} ${className}`}
        style={{
          border: searchStyleAsProp?.border || searchStyle.border,
          backgroundColor:
            searchStyleAsProp?.backgroundColor || searchStyle.backgroundColor,
          padding: searchStyleAsProp?.padding || searchStyle.padding,
          color: searchStyleAsProp?.color || searchStyle.color,
          borderRadius:
            searchStyleAsProp?.borderRadius || searchStyle.borderRadius,
          ...style,
        }}
        autoComplete="off"
      />
      <i className={`${styles.icon} ${iconClassName} pi pi-search`}></i>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  searchStyleAsProp: PropTypes.object,
  search: PropTypes.any,
  setSearch: PropTypes.any,
};

export default Search;
