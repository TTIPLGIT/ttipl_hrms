import { InputText } from "primereact/inputtext";
import styles from "./styles.module.css";
import PropTypes from "prop-types";
import React from "react";

export default function TextInput({
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
      <InputText
        id={id}
        name={name}
        defaultValue={defaultValue}
        style={{
          ...style,
        }}
        className={`${styles.textInput} ${className}`}
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
      {React.cloneElement(tagNeeded || <p className="my-0"></p>, {
        control,
      })}
    </>
  );
}

TextInput.propTypes = {
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
