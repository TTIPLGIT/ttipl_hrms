import { Dialog } from "primereact/dialog";

import Footer from "./Footer";

import styles from "./styles.module.css";

export default function CustomModal({
  header = "MODAL",
  bodyContent = "Traveling Internationally for Medical Care Each year, millions of US residents travel to another country for medical care which is called medical tourism. Medical tourists from the United States most commonly travel to Mexico and Canada, and to several other countries in Central America, South America, and the Caribbean. The reasons people may seek medical care in another country includeCost: To get a treatment or procedure that may be cheaper in another country Culture: To receive care from a clinician who shares the traveler’s culture and language Unavailable or unapproved procedures: To get a procedure or therapy that is not available or approved in the United States The most common procedures that people undergo on medical tourism trips include dental care, cosmetic surgery, fertility treatments, organ and tissue transplantation, and cancer treatment.s",
  visible,
  setVisible,
  content,
  featureControl = {
    isBackdropNeeded: true,
    isMaximizeNeeded: true,
    isDragNeeded: true,
    isResizeNeeded: true,
    closeOnOutsideClick: true,
  },
}) {
  const handleClose = () => setVisible(false);

  return (
    <Dialog
      header={<div>{header}</div>}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        handleClose();
      }}
      modal={featureControl?.isBackdropNeeded}
      maximizable={featureControl?.isMaximizeNeeded}
      style={{ width: "50vw" }}
      draggable={featureControl?.isDragNeeded}
      resizable={featureControl?.isResizeNeeded}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      footer={<Footer handleClose={handleClose} />}
      content={content && (({ hide }) => content(hide))}
      dismissableMask={featureControl?.closeOnOutsideClick && handleClose}
      className={styles.modal}
    >
      {typeof bodyContent === "string" && <p className="m-0 ">{bodyContent}</p>}
      {typeof bodyContent === "object" && { bodyContent }}
    </Dialog>
  );
}
