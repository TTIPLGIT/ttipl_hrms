import { InputOtp } from "primereact/inputotp";
import { Controller } from "react-hook-form";
import styles from "./styles.module.css";
import React from "react";
export default function OTP({
  id,
  name,
  defaultValue,
  style,
  className,
  labelText,
  labelStyle,
  labelClassName,
  control,
  required,
  validation,
  disabled,
  tagNeeded,
}) {
  return (
    <>
      <label
        htmlFor={id}
        style={labelStyle}
        className={`block ${styles.label} ${labelClassName}`}
      >
        {labelText}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required,
          validate: validation,
        }}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <>
            <InputOtp
              id={id}
              name={name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              style={{
                ...style,
              }}
              className={`${
                styles.otp
              } p-inputotp-input p-inputtext p-component beta ${
                className && className
              } ${fieldState.invalid && "p-invalid"} `}
              disabled={disabled}
            />
            {React.cloneElement(tagNeeded || <p></p>, {
              control,
            })}
          </>
        )}
      />
    </>
  );
}
