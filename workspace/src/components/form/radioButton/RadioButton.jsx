import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import PropTypes from "prop-types";
import { unProtectedCall } from "../../../services/userService";
import { capitalize } from "../../../utils/helper";

export default function CustomRadioButton({
  id,
  name,
  labelText = "Label",
  labelStyle,
  labelClassName,
  radioLabelClassName,
  radioLabelStyle,
  radioList = ["Option 1", "Option 2", "Option 3"],
  wrapperClass,
  wrapperStyle,
  register,
  required,
  validation,
  disabled,
  defaultValue,
  routeWithQuery,
  tagNeeded,
  control,
}) {
  const [newOptions, setNewOptions] = useState(radioList);

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
        className={`${styles.label} ${labelClassName}`}
      >
        {labelText}
      </label>
      <div className="grid">
        {newOptions
          ? newOptions?.map((category, index) => {
              return (
                <div
                  key={index}
                  style={wrapperStyle}
                  className={`col-12 md:col-6  flex  align-items-end ${styles.checkBoxWrapper} ${wrapperClass}`}
                >
                  <input
                    autoComplete="off"
                    id={id}
                    name={name}
                    type="radio"
                    {...register(
                      name,
                      required && {
                        required: required,
                        validate: validation,
                      }
                    )}
                    value={category}
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "var(--background-color) !important",
                    }}
                    disabled={disabled}
                    defaultChecked={category === defaultValue}
                  />
                  <label
                    htmlFor={id}
                    className={`${radioLabelClassName} ${styles.checkBoxLabel}`}
                    style={radioLabelStyle}
                  >
                    {capitalize(category || "")}
                  </label>
                </div>
              );
            })
          : radioList?.map((category, index) => {
              return (
                <div
                  key={index}
                  style={wrapperStyle}
                  className={`col-12 md:col-6  flex align-items-end ${styles.checkBoxWrapper} ${wrapperClass}`}
                >
                  <input
                    autoComplete="off"
                    id={id}
                    name={name}
                    type="radio"
                    {...register(
                      name,
                      required && {
                        required: required,
                        validate: validation,
                      }
                    )}
                    value={category}
                    style={{ width: "20px", height: "20px" }}
                    disabled={disabled}
                    defaultChecked={category === defaultValue}
                  />
                  <label
                    htmlFor={id}
                    className={`${radioLabelClassName} ${styles.checkBoxLabel}`}
                    style={radioLabelStyle}
                  >
                    {capitalize(category || "")}
                  </label>
                </div>
              );
            })}
      </div>
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}

CustomRadioButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  labelText: PropTypes.string,
  labelStyle: PropTypes.object,
  labelClassName: PropTypes.string,
  radioLabelClassName: PropTypes.string,
  radioLabelStyle: PropTypes.object,
  radioList: PropTypes.array.isRequired,
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.object,
  register: PropTypes.func.isRequired,
  required: PropTypes.string,
  validation: PropTypes.func,
  style: PropTypes.object,
};
