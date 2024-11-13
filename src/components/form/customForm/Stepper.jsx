import { Steps } from "primereact/steps";
import styles from "./styles.module.css";

import PropTypes from "prop-types";

export default function Stepper({
  items,
  activeIndex,
  setActiveIndex,
  handleSlice,
}) {
  return (
    <Steps
      model={items}
      activeIndex={activeIndex}
      onSelect={(e) => {
        setActiveIndex(e.index);
        handleSlice(e.index);
      }}
      readOnly={false}
      className={styles.pSteps}
      style={{ marginBottom: "3%" }}
    />
  );
}

Stepper.propTypes = {
  items: PropTypes.array.isRequired,
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  handleSlice: PropTypes.func.isRequired,
};
