import { BreadCrumb } from "primereact/breadcrumb";
// import Link from "next/link";
import { Link, useLocation } from "react-router-dom";
import { capitalize, convertUnderscoreToSpace } from "../../utils/helper";
import styles from "./styles.module.css";

const breadCrumbStyles = {
  text: "black",
  textActive: "#0066FF",
  boxShadowActive: "",
  // underlineActive: "underline",
};

export default function CustomBreadCrumb() {
  const { pathname } = useLocation();

  const items = pathname
    .split("/")
    .filter((elem) => elem !== "")
    .map((elem, index) => {
      return {
        label: (
          <span
            style={{
              backgroundColor: breadCrumbStyles?.bgActive,
              color: breadCrumbStyles?.textActive,
              boxShadow: breadCrumbStyles?.boxShadowActive,
              textDecoration: breadCrumbStyles?.underlineActive,
            }}
            className={styles.breadCrumb}
          >
            {capitalize(convertUnderscoreToSpace(elem))}
          </span>
        ),
        ...(index !== pathname.split("/").length - 2 && {
          template: () => (
            <Link
              className={styles.breadCrumb}
              style={{
                backgroundColor: breadCrumbStyles?.bg,
                color: breadCrumbStyles?.text,
                boxShadow: breadCrumbStyles?.boxShadow,
              }}
              to={`/${elem}`}
            >
              {capitalize(convertUnderscoreToSpace(elem))}
            </Link>
          ),
        }),
      };
    });

  return <BreadCrumb model={items} className={styles.parent} />;
}
