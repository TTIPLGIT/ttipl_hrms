import React from "react";
import styles from "./styles.module.css";
import PropTypes from "prop-types";

export default function NumberInput({
  id,
  name,
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  register,
  required,
  validation,
  placeholder = "Enter Number",
  disabled,
  tagNeeded,
  control,
}) {
  return (
    <>
      <label
        htmlFor={id}
        style={labelStyle}
        className={`block ${labelClassName}`}
      >
        {labelText}
      </label>
      <input
        role="spinbutton"
        type="number"
        inputMode="numeric"
        data-pc-name="inputtext"
        data-pc-section="root"
        id={id}
        name={name}
        defaultValue={defaultValue}
        style={style}
        placeholder={placeholder}
        className={`${className} ${styles.num} p-inputnumber-input p-inputtext p-component`}
        {...register(
          name,
          required && {
            required: required,
            validate: validation,
          }
        )}
        disabled={disabled}
      />
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}

NumberInput.propTypes = {
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
};
