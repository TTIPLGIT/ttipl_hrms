import Button from "../button/Button";
import styles from "./styles.module.css";

export default function Footer({ handleClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button name={"Close"} onClick={handleClose} className={styles.button} />
    </div>
  );
}
