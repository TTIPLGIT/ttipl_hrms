import PropTypes from "prop-types";
import styles from "./styles.module.css";

import successGif from "../../assests/images/success.gif";
import infoGif from "../../assests/images/info.gif";
import warningGif from "../../assests/images/warning.gif";
import errorGif from "../../assests/images/error.gif";

const AlertMessage = ({
  type,
  message1,
  message2,
  buttonText1,
  buttonText2,
  buttonText3,
  onButtonClick1,
  onButtonClick2,
  onButtonClick3,
  visible,
  onClose,
}) => {
  const getGif = (type) => {
    switch (type) {
      case "success":
        return successGif;
      case "info":
        return infoGif;
      case "warning":
        return warningGif;
      case "error":
        return errorGif;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.icon}>
        <img src={getGif(type)} alt={`${type} icon`} className={styles.gif} />
      </div>
      <div className={styles.text}>
        <h2>{message1}</h2>
        <p>{message2}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.alertButton1} onClick={onButtonClick1}>
          {buttonText1}
        </button>
        <button className={styles.alertButton2} onClick={onButtonClick2}>
          {buttonText2}
        </button>
        <button className={styles.alertButton3} onClick={onButtonClick3}>
          {buttonText3}
        </button>
      </div>
      <span className={styles.close} onClick={onClose}>
        &times;
      </span>
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(["success", "info", "warning", "error"]).isRequired,
  message1: PropTypes.string.isRequired,
  message2: PropTypes.string.isRequired,
  buttonText1: PropTypes.string.isRequired,
  buttonText2: PropTypes.string.isRequired,
  buttonText3: PropTypes.string.isRequired,
  onButtonClick1: PropTypes.func.isRequired,
  onButtonClick2: PropTypes.func.isRequired,
  onButtonClick3: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertMessage;
