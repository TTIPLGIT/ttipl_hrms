import { InputTextarea } from "primereact/inputtextarea";
import styles from "./styles.module.css";

import PropTypes from "prop-types";
import React from "react";

export default function TextArea({
  id,
  name,
  onChange,
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  rows = 1,
  cols = 26,
  register,
  required,
  validation,
  disabled,
  placeholder,
  tagNeeded,
  control,
}) {
  return (
    <>
      <label htmlFor={id} style={labelStyle} className={`${labelClassName}`}>
        {labelText}
      </label>
      <InputTextarea
        id={id}
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        style={{
          background: "var(--background-color) !important",
          ...style,
        }}
        className={`${styles.textArea} ${className}`}
        toggleMask
        rows={rows}
        cols={cols}
        placeholder={placeholder}
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

TextArea.propTypes = {
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
  rows: PropTypes.number,
  cols: PropTypes.number,
};
