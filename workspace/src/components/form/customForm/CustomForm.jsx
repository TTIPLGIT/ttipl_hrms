import { FormProvider, useForm } from "react-hook-form";
import Button from "../../button/Button";
import CustomCheckBox from "../checkBox/CheckBox";
import DatePicker from "../datePicker/DatePicker";
import CustomDropDrown from "../dropdown/CustomDropDown";
import NumberInput from "../number/NumberInput";
import CustomPassword from "../password/CustomPassword";
import CustomRadioButton from "../radioButton/RadioButton";
import TextInput from "../text/TextInput";
import TextArea from "../textArea/TextArea";
import FileUpload from "../file/FileUpload";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import Stepper from "./Stepper";
import PropTypes from "prop-types";

import styles from "./styles.module.css";
import Phone from "../phone/Phone";
import OTP from "../otp/OTP";

export default function CustomForm({
  steps = {
    isStepperNeeded: false,
    noFieldsInAStep: 0,
    stepperLabel: [
      { label: "personal info" },
      { label: "other info" },
      { label: "other info" },
      { label: "other info" },
    ],
  },
  formDT,
  formStyles = {},
  extraButtons = [],
  submitButton = true,
  submitAction,
  formWrapperStyle,
  methods,
  isSection = false,
}) {
  const { isStepperNeeded, noFieldsInAStep, stepperLabel } = steps;
  const [activeIndex, setActiveIndex] = useState(0);
  const stepsCount = Math.ceil(formDT?.length / noFieldsInAStep);

  const [slice, setSlice] = useState({
    from: 0,
    to: noFieldsInAStep,
  });

  const [inc, setInc] = useState(0);
  const { register, handleSubmit, watch, control } = methods;

  const handleSlice = (e) => {
    setSlice(() => {
      if (inc < e) {
        setInc(inc + 1);
      } else if (inc > e) {
        setInc(inc - 1);
      }

      return {
        from: e * noFieldsInAStep,
        to: (e + 1) * noFieldsInAStep,
      };
    });
  };

  const submitIfSteps = (data) => {
    if (activeIndex < stepsCount - 1) {
      setActiveIndex(activeIndex + 1);
      const to = Number(slice.to);
      setSlice({
        from: to,
        to: to + Number(noFieldsInAStep),
      });
    }

    if (activeIndex === stepsCount - 1 && submitAction) submitAction(data);
  };
  const onSubmit = (data) => {
    submitAction(data);
  };
  const handlePrev = (e) => {
    e.preventDefault();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      const to = slice.to;
      const from = slice.from;
      setSlice({
        from: from - Number(noFieldsInAStep),
        to: to - Number(noFieldsInAStep),
      });
    }
  };

  const toast = useRef(null);
  const showError = (errorMsg) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMsg,
      life: 3000,
    });
  };

  const onError = (e) => {
    let count = 0;
    formDT?.forEach((elem) => {
      if (e[elem?.id] && count === 0) {
        toast.current.clear();
        const errorMsg = e[elem?.id].message || `Enter ${elem?.labelText}`;
        showError(errorMsg);
        count++;
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          steps?.isStepperNeeded ? submitIfSteps : onSubmit,
          onError
        )}
      >
        {isStepperNeeded && noFieldsInAStep !== formDT?.length && (
          <Stepper
            items={stepperLabel?.slice(0, stepsCount)}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            handleSlice={handleSlice}
          />
        )}
        <div className="grid" style={formWrapperStyle}>
          {formDT
            ?.slice(
              isStepperNeeded ? slice.from : 0,
              isStepperNeeded ? slice.to : formDT?.length
            )
            ?.map((elem, index) => {
              let conditionConverter = {
                greaterThan:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) >
                    watch(elem?.compareInputName) || elem?.compareValue,
                lesserThan:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) <
                  (elem?.compareInputName
                    ? watch(elem?.compareInputName)
                    : elem?.compareValue),
                lesserThanEqual:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) <=
                  (elem?.compareInputName
                    ? watch(elem?.compareInputName)
                    : elem?.compareValue),
                greaterThanEqual:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) >=
                  (elem?.compareInputName
                    ? watch(elem?.compareInputName)
                    : elem?.compareValue),
                equal:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) ===
                  (elem?.compareInputName
                    ? watch(elem?.compareInputName)
                    : elem?.compareValue),
                notEqual:
                  (watch(elem?.conditionInputName) === undefined
                    ? null
                    : watch(elem?.conditionInputName)) !==
                  (elem?.compareInputName
                    ? watch(elem?.compareInputName)
                    : elem?.compareValue),
              };
              const isFirstFieldInSection =
                index === 0 || formDT[index - 1].section !== elem.section;
              return (
                <>
                  {isFirstFieldInSection ? (
                    <h3 className="text-blue-600">{elem.section}</h3>
                  ) : null}
                  {elem?.type === "checkbox" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <CustomCheckBox
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,
                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              accentColor: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,
                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,

                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                            id={elem?.id}
                            name={elem?.name}
                            labelText={elem?.labelText}
                            register={register}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            checkBoxList={elem?.options}
                            routeWithQuery={
                              elem.fetchDataBasedOn
                                ? `data?drilldowns=${watch(
                                    elem.fetchDataBasedOn
                                  )}&measures=Population`
                                : ""
                            }
                            responseFunction={elem?.responseFunction}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "date" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <DatePicker
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                            labelText={elem?.labelText}
                            id={elem?.id}
                            name={elem?.name}
                            placeholder="DD-MM-YYY"
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                          />
                        </div>
                        {/* {React.cloneElement(elem?.tagNeeded || <p></p>, {
                          control,
                        })} */}
                      </>
                    )}
                  {elem?.type === "select" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <CustomDropDrown
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            options={elem?.options}
                            routeWithQuery={
                              elem?.fetchDataBasedOn
                                ? `data?drilldowns=${watch(
                                    elem.fetchDataBasedOn
                                  )}&measures=Population`
                                : ""
                            }
                            responseFunction={elem?.responseFunction}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                        {/* {React.cloneElement(elem?.tagNeeded || <p></p>, {
                          control,
                        })} */}
                      </>
                    )}

                  {elem?.type === "file" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <FileUpload
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "password" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <CustomPassword
                            labelText={elem?.labelText}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "number" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <NumberInput
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "phone" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <Phone
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            control={control}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "otp" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <OTP
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            control={control}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "radio" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <CustomRadioButton
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            routeWithQuery={
                              elem?.fetchDataBasedOn
                                ? `data?drilldowns=${watch(
                                    elem.fetchDataBasedOn
                                  )}&measures=Population`
                                : ""
                            }
                            responseFunction={elem?.responseFunction}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                            radioList={elem?.options}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "text" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <TextInput
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,
                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,
                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                      </>
                    )}
                  {elem?.type === "textarea" &&
                    (!elem?.conditionRequired ||
                      conditionConverter[elem?.condition]) && (
                      <>
                        <div
                          className={`col-${
                            formStyles?.noOfFledsInARow?.sm || 12
                          } md:col-${
                            formStyles?.noOfFledsInARow?.md || 6
                          } lg:col-${
                            formStyles?.noOfFledsInARow?.lg || 3
                          } xl:col-${formStyles?.noOfFledsInARow?.xl || 3}`}
                        >
                          <TextArea
                            labelText={elem?.labelText}
                            register={register}
                            disabled={elem?.disabled}
                            defaultValue={elem?.defaultValue}
                            required={elem?.required || false}
                            validation={elem?.validation}
                            placeholder={elem?.placeholder}
                            id={elem?.id}
                            name={elem?.name}
                            labelStyle={{
                              color: formStyles?.labelStyle?.text,
                              padding: formStyles?.labelStyle?.padding,
                              fontSize: formStyles?.labelStyle?.fontSize,

                              fontWeight: formStyles?.labelStyle?.fontWeight,
                            }}
                            style={{
                              color: formStyles?.inputFields?.text,
                              fontSize: formStyles?.inputFields?.fontSize,

                              fontWeight: formStyles?.inputFields?.fontWeight,
                              border: formStyles?.inputFields?.border,
                              padding: formStyles?.inputFields?.padding,
                              backgroundColor: formStyles?.inputFields?.bgColor,
                            }}
                            tagNeeded={elem?.tagNeeded}
                            control={control}
                          />
                        </div>
                      </>
                    )}
                </>
              );
            })}
        </div>
        <div
          className={styles.buttonWrapper}
          style={{
            justifyContent: formStyles?.buttonWrapper?.alignment || "center",
          }}
        >
          <Toast ref={toast} />

          {extraButtons?.map((elem, i) => {
            if (elem?.BorASubmit === "b")
              return (
                <Button
                  key={i}
                  name={elem.name}
                  icon={elem?.icon}
                  onClick={elem?.btnAction}
                  style={{ backgroundColor: elem?.color, ...elem.style }}
                  className={elem?.className}
                />
              );
          })}

          {isStepperNeeded && noFieldsInAStep !== formDT?.length && (
            <Button
              name="Previous"
              icon={{ BorAname: "b", iconName: "pi pi-chevron-left" }}
              onClick={handlePrev}
            />
          )}
          {noFieldsInAStep === formDT?.length ||
            (!isStepperNeeded && submitButton && (
              <Button
                className="font-bold"
                name="Submit"
                icon={{ BorAname: "b", iconName: "" }}
              />
            ))}
          {extraButtons?.map((elem, i) => {
            if (elem?.BorASubmit === "a")
              return (
                <Button
                  key={i}
                  name={elem.name}
                  icon={elem?.icon}
                  onClick={elem?.btnAction}
                  style={{ backgroundColor: elem?.color, ...elem.style }}
                  className={elem?.className}
                />
              );
          })}
          {submitButton &&
            isStepperNeeded &&
            noFieldsInAStep !== formDT?.length && (
              <Button
                name={activeIndex === stepsCount - 1 ? "Submit" : "Next"}
                icon={{
                  BorAname: inc === activeIndex ? "a" : "b",
                  iconName:
                    inc === activeIndex
                      ? "pi pi-chevron-right"
                      : "pi pi-check-square",
                }}
              />
            )}
        </div>
      </form>
    </FormProvider>
  );
}

CustomForm.propTypes = {
  steps: PropTypes.shape({
    isStepperNeeded: PropTypes.bool,
    noFieldsInAStep: PropTypes.number,
    stepperLabel: PropTypes.arrayOf(PropTypes.object),
  }),
  submitAction: PropTypes.func,
  formDT: PropTypes.arrayOf(PropTypes.object),
  formStyles: PropTypes.object,
  extraButtons: PropTypes.arrayOf(PropTypes.object),
};
