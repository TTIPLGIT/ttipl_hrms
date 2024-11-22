import { Card } from "primereact/card";
import Button from "../../components/button/Button";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { unProtectedCall } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const CheckOtpMain = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.email.email);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(120); // OTP expiration timer
  const [resendTimer, setResendTimer] = useState(30); // Resend OTP timer
  const [canResend, setCanResend] = useState(false); // State for enabling/disabling resend text
  // const [canEnterOtp, setCanEnterOtp] = useState(true); // State for enabling/disabling OTP input
  const toast = useRef(null);

  useEffect(() => {
    const savedOtpTime = localStorage.getItem("otpStartTime");
    const savedResendTime = localStorage.getItem("resendStartTime");

    const now = new Date().getTime();

    // Calculate OTP expiration timer
    if (savedOtpTime) {
      const elapsedOtpTime = Math.floor((now - savedOtpTime) / 1000);
      const remainingOtpTime = 120 - elapsedOtpTime;
      if (remainingOtpTime > 0) {
        setOtpTimer(remainingOtpTime);
      } else {
        setOtpTimer(0);
        // setCanEnterOtp(false); // Disable input if OTP expired
      }
    }

    // Calculate Resend OTP timer
    if (savedResendTime) {
      const elapsedResendTime = Math.floor((now - savedResendTime) / 1000);
      const remainingResendTime = 30 - elapsedResendTime;
      if (remainingResendTime > 0) {
        setResendTimer(remainingResendTime);
        setCanResend(false); // Disable resend text until countdown finishes
      } else {
        setResendTimer(0);
        setCanResend(true); // Enable resend after countdown
      }
    }

    // Start the OTP expiration countdown
    const otpCountdown = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev === 1) {
          clearInterval(otpCountdown);
          // setCanEnterOtp(false); // Disable input when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start the Resend OTP countdown
    if (!canResend) {
      const resendCountdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(resendCountdown);
            setCanResend(true); // Enable resend when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(resendCountdown); // Cleanup on unmount
    }

    return () => clearInterval(otpCountdown); // Cleanup on unmount
  }, [canResend]);

  useEffect(() => {
    // Save the current time to localStorage on page load/reload
    const otpStartTime = new Date().getTime();
    const resendStartTime = new Date().getTime();

    if (otpTimer === 120) {
      localStorage.setItem("otpStartTime", otpStartTime);
    }

    if (resendTimer === 30) {
      localStorage.setItem("resendStartTime", resendStartTime);
    }
  }, [otpTimer, resendTimer]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    if (/^[0-9]?$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (value === "") {
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleOtpButton = async () => {
    const otpCode = otp.join("");
    try {
      const response = await unProtectedCall(
        "api/otp/verify",
        { email: email, otp: otpCode },
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "OTP verified!",
      });
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "OTP verification failed!",
      });
    }
  };

  const handleRequestNewOtp = async () => {
    if (!canResend) return; // Prevent resending if not allowed

    try {
      await unProtectedCall("api/otp/resend", { email: email }, "post");
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "New OTP has been sent!",
      });
      setOtp(Array(6).fill("")); // Clear the current OTP inputs
      setOtpTimer(120); // Reset OTP timer to 2 minutes
      setResendTimer(30); // Reset resend timer to 30 seconds
      setCanResend(false); // Disable the resend text until the next countdown
      localStorage.setItem("otpStartTime", new Date().getTime()); // Reset OTP start time
      localStorage.setItem("resendStartTime", new Date().getTime()); // Reset Resend start time
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to resend OTP!",
      });
    }
  };

  const handleRedirectToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className={styles.outerContainer}>
      <Toast ref={toast} />
      <Card className={styles.formCard}>
        <div className="text-center flex flex-column gap-2 px-4 py-2">
          <h1 className="text-gray-900 my-0 text-5xl font-bold">
            Enter your OTP
          </h1>
          <p className="my-0 font-medium">Code has been sent to</p>
          <span className="font-bold">{email}</span>
          <div>
            <span
              className="text-sm font-medium"
              onClick={handleRedirectToForgotPassword}
              style={{ cursor: "pointer" }}
            >
              Not your email? Click here to enter a new one.
            </span>
          </div>
          <div className={styles.otpContainer}>
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.otpInput}
                // disabled={!canEnterOtp} // Disable input if timer has expired
              />
            ))}
          </div>
          <div className="parentContainer">
            <Button
              type="button"
              className={styles.otpButton}
              name="Verify"
              onClick={handleOtpButton}
            />
            {/* Resend OTP text */}
            {canResend ? (
              <span
                className={styles.resendOtpText}
                onClick={handleRequestNewOtp}
                style={{ cursor: "pointer", color: "gray" }}
              >
                Resend OTP
              </span>
            ) : (
              <span style={{ color: "gray" }}>
                Resend OTP in {resendTimer} seconds
              </span>
            )}
          </div>
          {/* Timer for OTP expiration */}
          {/* <p style={{ color: "red" }}>OTP expires in {otpTimer} seconds</p> */}

          {/* Not your email? section */}
        </div>
      </Card>
    </div>
  );
};

export default CheckOtpMain;
