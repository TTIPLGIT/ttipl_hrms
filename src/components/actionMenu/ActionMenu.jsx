import { Menu } from "primereact/menu";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

export default function ActionMenu({ items }) {
  return (
    <>
      <Menu model={items} className={styles.actionMenu} />
    </>
  );
}

ActionMenu.proptypes = {
  items: PropTypes.array.isRequired,
};
