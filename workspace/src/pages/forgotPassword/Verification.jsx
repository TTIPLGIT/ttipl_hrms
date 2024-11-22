import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import Button from "../../components/button/Button";
import { unProtectedCall } from "../../services/userService";
import styles from "./styles.module.css";

const Verification = ({ userId, setResetPassword }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const toast = useRef(null);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    if (/^[0-9]?$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (value === "") {
      setOtp(newOtp.map((_, i) => (i === index ? "" : newOtp[i])));
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleOtpButton = async () => {
    const otpCode = otp.join("");
    try {
      await unProtectedCall(
        "api/otp/verify",
        { userId: userId, otp: otpCode },
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "OTP verified!",
      });
      setResetPassword(true);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "OTP verification failed!",
      });
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className={styles.otpContainer}>
      <h1>Enter your OTP</h1>
      <div className={styles.otpInputContainer}>
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            className={styles.otpInput}
          />
        ))}
      </div>
      <div className={styles.timerContainer}>
        {timeLeft > 0 ? (
          <p>Time left to enter OTP: {formatTime()}</p>
        ) : (
          <p className={styles.timerExpired}>
            OTP has expired. Please request a new code.
          </p>
        )}
      </div>
      <Button
        type="button"
        className={styles.otpButton}
        name="Verify"
        onClick={handleOtpButton}
      />
    </div>
  );
};

export default Verification;
