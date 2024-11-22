import CustomForm from "./CustomForm";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

export default function CustomFormWrapper({
  formName = "",
  formDT = [],
  wrapperClassName = "",
  wrapperStyle = {},
  headingClassName = "",
  headingSyle = {},
  bodyStyle = {},
  bodyClassName = "",
  formWrapper,
  formStyles,
  extraButtons,
  submitButton,
  submitAction,
  steps,
  methods,
}) {
  return (
    <>
      <div
        className={`mt-1 ${styles.wrapperClass} ${wrapperClassName}`}
        style={{
          boxShadow: formWrapper?.wrapper?.boxShadow,
          backgroundColor: formWrapper?.wrapper?.bg,
          borderRadius: formWrapper?.wrapper?.borderRadius,
          border: formWrapper?.wrapper?.border,
          overflow: "auto",
          ...wrapperStyle,
        }}
      >
        <p
          className={`px-5 pt-3 pb-3 ${styles.heading} ${headingClassName}`}
          style={{
            backgroundColor: formWrapper?.heading?.bg,
            color: formWrapper?.heading?.text,
            fontSize: formWrapper?.heading?.fontSize,
            fontWeight: formWrapper?.heading?.fontWeight,
            ...headingSyle,
          }}
        >
          {formName}
        </p>
        <div
          className={`px-5 ${bodyClassName} ${styles.bodyClassName}`}
          style={bodyStyle}
        >
          <CustomForm
            submitAction={submitAction}
            formDT={formDT}
            formStyles={formStyles}
            extraButtons={extraButtons}
            submitButton={submitButton}
            steps={steps}
            methods={methods}
          />
        </div>
      </div>
    </>
  );
}

CustomFormWrapper.propTypes = {
  formName: PropTypes.string,
  formDT: PropTypes.array.isRequired,
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.object,
  headingClassName: PropTypes.string,
  headingSyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  bodyClassName: PropTypes.string,
  formWrapper: PropTypes.string,
  formStyles: PropTypes.object,
  extraButtons: PropTypes.arrayOf(PropTypes.object),
  submitButton: PropTypes.bool,
};
