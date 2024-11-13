import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import styles from "./styles.module.css";
import PropTypes from "prop-types";

export default function DatePicker({
  id,
  name,
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  placeholder = "DD-MM-YYYY",
  register,
  required,
  validation,
  disabled,
  tagNeeded,
  control,
}) {
  // Helper function to parse date from "DD-MM-YYYY" format
  const parseDate = (value) => {
    if (!value) return null;

    // Convert "DD-MM-YYYY" to Date object
    const [day, month, year] = value.split("-");
    const parsedDate = new Date(year, month - 1, day);

    // Check if parsedDate is valid
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const [date, setDate] = useState(parseDate(defaultValue));

  // Update date when defaultValue changes
  useEffect(() => {
    setDate(parseDate(defaultValue));
  }, [defaultValue]);

  return (
    <>
      <label
        htmlFor={id}
        style={labelStyle}
        className={`block ${styles.label} ${labelClassName}`}
      >
        {labelText}
      </label>
      <Calendar
        className={`${className} ${styles.date}`}
        style={style}
        name={name}
        id={id}
        value={date}
        onChange={(e) => setDate(e.value)}
        placeholder={placeholder}
        {...(register &&
          register(
            name,
            required ? { required: required, validate: validation } : {}
          ))}
        disabled={disabled}
      />
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}

DatePicker.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string, // Should be in "DD-MM-YYYY" format if a string
  labelText: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  labelClassName: PropTypes.string,
  register: PropTypes.func,
  required: PropTypes.string,
  validation: PropTypes.func,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
