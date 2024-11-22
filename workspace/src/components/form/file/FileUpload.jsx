import React from "react";
import styles from "./styles.module.css";
import PropTypes from "prop-types";

export default function FileUpload({
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
  placeholder,
  accept,
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
        type="file"
        id={id}
        name={name}
        defaultValue={defaultValue}
        style={style}
        className={`${styles} ${className}`}
        placeholder={placeholder}
        {...register(
          name,
          required && {
            required: required,
            validate: validation,
          }
        )}
        accept={accept}
        disabled={disabled}
      />
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}

FileUpload.propTypes = {
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
  accept: PropTypes.string,
};
