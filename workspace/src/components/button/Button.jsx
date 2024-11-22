import PropTypes from "prop-types";
import styles from "./styles.module.css";

// IconButton Component
const Button = ({
  icon = { BorAname: "b", iconName: "" },
  name,
  onClick,
  className,
  color = {},
  ...rest
}) => {
  return (
    <button
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      {...rest}
      style={{ backgroundColor: color?.bg, color: color?.text }}
    >
      {icon?.BorAname === "b" && icon?.iconName && (
        <i className={`${icon?.iconName} ${styles.iconButtonLogo}`} />
      )}
      {name && <span className={styles.iconButtonName}>{name}</span>}
      {icon?.BorAname === "a" && icon?.iconName && (
        <i className={`${icon?.iconName} ${styles.iconButtonLogo}`} />
      )}
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
