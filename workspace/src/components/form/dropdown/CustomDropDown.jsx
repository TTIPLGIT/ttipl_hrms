import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import PropTypes from "prop-types";
import { unProtectedCall } from "../../../services/userService";

export default function CustomDropdown({
  id,
  name,
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  placeholder = "Select an option",
  options = ["New York", "Rome", "London", "Istanbul", "Paris"],
  register,
  required,
  validation,
  disabled,
  routeWithQuery,
  tagNeeded,
  control,
}) {
  const [newOptions, setNewOptions] = useState(options);

  useEffect(() => {
    const data = async () => {
      if (routeWithQuery) {
        try {
          const response = await unProtectedCall(routeWithQuery);
          setNewOptions(response?.data?.map((elem) => elem.Nation));
          console.log(response);
        } catch (error) {
          console.error("Error fetching options:", error);
        }
      }
    };
    data();
  }, [routeWithQuery]);
  return (
    <>
      <label
        htmlFor={id}
        style={labelStyle}
        className={`block  ${labelClassName}`}
      >
        {labelText}
      </label>
      <select
        className={`${styles.select} ${className}`}
        style={{ width: "70%", ...style }}
        name={name}
        id={id}
        defaultValue={defaultValue}
        aria-labelledby={id}
        {...register(
          name,
          required && {
            required: required,
            validate: validation,
          }
        )}
        disabled={disabled}
      >
        <option value={""}>{placeholder}</option>
        {routeWithQuery
          ? newOptions?.map((elem, index) => {
              return (
                <option className={styles.options} key={index}>
                  {elem}
                </option>
              );
            })
          : options?.length &&
            options?.map((elem, index) => {
              return (
                <option className={styles.options} key={index}>
                  {elem}
                </option>
              );
            })}
      </select>
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}

CustomDropdown.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  labelText: PropTypes.string,
  labelStyle: PropTypes.object,
  labelClassName: PropTypes.string,
  register: PropTypes.func.isRequired,
  required: PropTypes.string,
  validation: PropTypes.func,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
};
