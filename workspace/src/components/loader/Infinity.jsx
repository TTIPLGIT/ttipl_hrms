import { useState } from "react";
import styles from "./styles.module.css";

const Backdrop = ({ show, onClick, children }) => {
  return show ? (
    <div className={styles.backdrop} onClick={onClick}>
      <div
        className={styles.backdropContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default function InfinityLoader() {
  const [showBackdrop, setShowBackdrop] = useState(true);

  const toggleBackdrop = () => {
    setShowBackdrop(!showBackdrop);
  };

  return (
    <Backdrop show={showBackdrop} onClick={toggleBackdrop}>
      <svg
        viewBox="0 0 256 128"
        width="100px"
        height="50px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="33%" stopColor="var(--primary-color)" />
            <stop offset="67%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--primary-color)" />
          </linearGradient>
          <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="33%" stopColor="var(--primary-color)" />
            <stop offset="67%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--primary-color)" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round" strokeWidth="16">
          <g className={styles.ipTrack} stroke="#ddd">
            <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
            <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
          </g>
          <g strokeDasharray="180 656">
            <path
              className={styles.ipWorm1}
              stroke="url(#grad1)"
              strokeDashoffset="0"
              d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"
            />
            <path
              className={styles.ipWorm2}
              stroke="url(#grad2)"
              strokeDashoffset="358"
              d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"
            />
          </g>
        </g>
      </svg>
    </Backdrop>
  );
}
