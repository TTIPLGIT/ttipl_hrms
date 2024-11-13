import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "./styles.module.css";
import React from "react";

export default function Phone({
  id,
  name,
  control, // Added to receive control from useForm
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  required,
  validation,
  placeholder,
  disabled,
  tagNeeded,
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
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        rules={{
          required: required,
          validate: validation,
        }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            id={id}
            country={"in"}
            style={{
              ...style,
            }}
            className={`${className} ${styles.phone}`}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      />
      {React.cloneElement(tagNeeded || <p></p>, {
        control,
      })}
    </>
  );
}
