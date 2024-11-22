import styles from "./styles.module.css";
import { capitalize } from "../../../utils/helper";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { unProtectedCall } from "../../../services/userService";

export default function CustomCheckBox({
  id,
  name,
  defaultValue,
  labelText = "Label",
  labelStyle,
  labelClassName,
  checkLabelClassName,
  checkLabelStyle,
  checkBoxList = ["Option 1", "Option 2", "Option 3"],
  wrapperClass,
  wrapperStyle = {},
  register,
  required,
  validation,
  style,
  disabled,
  routeWithQuery,
}) {
  const [newOptions, setNewOptions] = useState(checkBoxList);

  useEffect(() => {
    const data = async () => {
      if (routeWithQuery) {
        try {
          const response = await unProtectedCall(routeWithQuery);
          setNewOptions(
            response?.data?.map((elem) => elem?.Population?.toString())
          );
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
      <label style={labelStyle} className={`${styles.label} ${labelClassName}`}>
        {labelText}
      </label>
      <div className="grid">
        {newOptions
          ? newOptions?.map((category, index) => {
              return (
                <div
                  key={index}
                  style={wrapperStyle}
                  className={`col-12 md:col-6  flex align-items-end	 ${styles.checkBoxWrapper} ${wrapperClass} `}
                >
                  <input
                    autoComplete="off"
                    type={"checkbox"}
                    name={name}
                    id={id}
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
                      backgroundColor: "red",
                      ...style,
                    }}
                    disabled={disabled}
                    defaultChecked={category === defaultValue}
                  />
                  <label
                    htmlFor={id}
                    className={`${checkLabelClassName} ${styles.checkBoxLabel}`}
                    style={checkLabelStyle}
                  >
                    {typeof category === "string"
                      ? capitalize(category || "")
                      : category}
                  </label>
                </div>
              );
            })
          : checkBoxList?.map((category, index) => {
              return (
                <div
                  key={index}
                  style={wrapperStyle}
                  className={`col-12 md:col-6  flex align-items-end	 ${styles.checkBoxWrapper} ${wrapperClass} `}
                >
                  <input
                    autoComplete="off"
                    type={"checkbox"}
                    name={name}
                    id={id}
                    {...register(
                      name,
                      required && {
                        required: required,
                        validate: validation,
                      }
                    )}
                    value={category}
                    style={{ width: "20px", height: "20px", ...style }}
                    disabled={disabled}
                    defaultChecked={category === defaultValue}
                  />
                  <label
                    htmlFor={id}
                    className={`${checkLabelClassName} ${styles.checkBoxLabel}`}
                    style={checkLabelStyle}
                  >
                    {typeof category === "string"
                      ? capitalize(category || "")
                      : category}
                  </label>
                </div>
              );
            })}
      </div>
    </>
  );
}

CustomCheckBox.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  labelText: PropTypes.string,
  labelStyle: PropTypes.object,
  labelClassName: PropTypes.string,
  checkLabelClassName: PropTypes.string,
  checkLabelStyle: PropTypes.object,
  checkBoxList: PropTypes.array.isRequired,
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.object,
  register: PropTypes.func.isRequired,
  required: PropTypes.string,
  validation: PropTypes.func,
  style: PropTypes.object,
};
