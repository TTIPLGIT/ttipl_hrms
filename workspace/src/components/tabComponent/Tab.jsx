import { TabView, TabPanel } from "primereact/tabview";
import PropTypes from "prop-types";
import { Avatar } from "primereact/avatar";
import styles from "./styles.module.css";

export default function Tab({
  tabView = [
    {
      element: <p>hi</p>,
      func: (options) => {
        return (
          <div
            className="flex align-items-center px-3"
            style={{ cursor: "pointer" }}
            onClick={options.onClick}
          >
            <i className="pi pi-prime mr-2" />
            Hi
          </div>
        );
      },
    },
    {
      element: <p>bye</p>,
      func: (options) => {
        return (
          <div
            className="flex align-items-center px-3"
            style={{ cursor: "pointer" }}
            onClick={options.onClick}
          >
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              shape="circle"
              className="mx-2"
            />
            Amy Elsner
          </div>
        );
      },
    },
  ],
}) {
  return (
    <TabView className={styles.tabView}>
      {tabView?.map((elem, index) => (
        <TabPanel
          key={index}
          headerTemplate={elem.func}
          headerClassName="flex align-items-center"
        >
          {elem.element}
        </TabPanel>
      ))}
    </TabView>
  );
}

Tab.propTypes = {
  tabView: PropTypes.arrayOf(PropTypes.object),
};
