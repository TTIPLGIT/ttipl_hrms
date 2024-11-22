import { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import styles from "./styles.module.css";
import Button from "../../components/button/Button";
import TextInput from "../../components/form/text/TextInput";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import forgetPassword from "../../assests/images/forget.png";
import { useNavigate } from "react-router-dom";
import { unProtectedCall } from "../../services/userService";
import { ProgressSpinner } from "primereact/progressspinner";
import bcrypt from "bcryptjs"; // Import bcryptjs
import CustomPassword from "../../components/form/password/CustomPassword";
import { setEmail } from "./emailSlice"; // Adjust the import based on your file structure
import { useDispatch, useSelector } from "react-redux";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.email.email);
  const [showOtp, setShowOtp] = useState(false);
  const [emailStore, setEmailStore] = useState("");
  const [otp, setOtp] = useState(Array(6).fill("")); // State for OTP input
  const [resetPassword, setResetPassword] = useState(false);
  const [userId, setUserId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const toast = useRef(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  useEffect(() => {
    if (showOtp) {
      document.getElementById("otp-0").focus(); // Focus the first OTP input
    }
  }, [showOtp]); // const onSubmit = async (data) => { //   console.log("Email: ", data.email); //   setEmailStore(data.email); //   try { //     // Fetch user ID by email //     const response = await unProtectedCall( //       "api/users/get-id-by-email", //       { email: data.email }, //       "post" //     ); //     if (response.id) { //       // Store userId //       setUserId(response.id.toString()); //       // Generate OTP //       const otpResponse = await unProtectedCall( //         "api/otp/generate", //         { email: data.email }, //         "post" //       ); //       if (otpResponse && otpResponse.success) { //         // Check if OTP generation was successful //         setShowOtp(true); //         toast.current.show({ //           severity: "success", //           summary: "Success", //           detail: "Verification code sent!", //         }); //       } else { //         throw new Error("Failed to send verification code"); //       } //     } else { //       throw new Error("User ID not found"); //     } //   } catch (error) { //     console.error(error); //     // Only show the toast for email-related errors if showOtp is already true //     if (showOtp) { //       toast.current.show({ //         severity: "error", //         summary: "Error", //         detail: "Could not send OTP. Please try again later.", //       }); //     } else { //       toast.current.show({ //         severity: "error", //         summary: "Error", //         detail: "Email ID does not exist", //       }); //     } //   } // };
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    console.log("Email: ", data.email);
    setEmailStore(data.email);
    dispatch(setEmail(data.email));
    setLoading(true); // Set loader to true when starting the operation
    try {
      // Fetch user ID by email
      const response = await unProtectedCall(
        "api/users/get-id-by-email",
        { email: email },
        "post"
      );
      if (response.id) {
        // Store userId
        setUserId(response.id.toString()); // Generate OTP
        const otpResponse = await unProtectedCall(
          "api/otp/generate",
          { email: email },
          "post"
        );
        if (otpResponse && otpResponse.success) {
          // Check if OTP generation was successful
          setShowOtp(true);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Verification code sent!",
          });
        } else {
          throw new Error("Failed to send verification code");
        }
      } else {
        throw new Error("User ID not found");
      }
    } catch (error) {
      console.error(error); // Only show the toast for email-related errors if showOtp is already true
      if (showOtp) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Could not send OTP. Please try again later.",
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Email ID does not exist",
        });
      }
    } finally {
      setLoading(false); // Turn off loader after the operation is complete
    }
  };
  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    });
  };
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    if (/^[0-9]?$/.test(value)) {
      // If the value is a digit, update the current OTP index
      newOtp[index] = value;
      setOtp(newOtp); // Move focus to the next input if a digit is entered
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (value === "") {
      // Handle backspace
      setOtp(newOtp.map((_, i) => (i === index ? "" : newOtp[i]))); // Clear current input // Move focus back to the previous input if backspace is pressed
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  }; // Handle key down event to specifically check for backspace
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && otp[index] === "") {
      // Move focus back to the previous input if backspace is pressed on an empty input
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
        { email: email, otp: otpCode },
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
  const onResetPasswordSubmit = async (data) => {
    // Hash the new password before sending it to the backend
    const hashedPassword = bcrypt.hashSync(data.newPassword, 10); // 10 is the salt rounds
    if (data.newPassword !== data.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match!",
      });
      return;
    }
    try {
      await unProtectedCall(
        "api/users/update-password",
        { userId: userId, newPassword: hashedPassword },
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password has been reset successfully!",
      }); // Add a 2-second delay before navigating
      setTimeout(() => {
        navigate("/");
      }, 2000); // 2000 milliseconds = 2 seconds
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password reset failed!",
      });
    }
  };
  // timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId); // Clear timer when component unmounts
    }
  }, [timeLeft]);
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  return (
    <div className={styles.outerContainer}>
            <Toast ref={toast} />     {" "}
      <div className={styles.forgotPasswordContainer}>
               {" "}
        {!showOtp ? (
          <Card className={styles.formCard}>
                       {" "}
            <div className={styles.logoContainer}>
                           {" "}
              <img
                src={forgetPassword}
                className="w-2 mx-auto"
                alt="Forget Password"
              />
                           {" "}
              <h1 className="text-4xl font-bold text-center m-2">
                                Reset your password              {" "}
              </h1>
                           {" "}
              <p className="text-sm text-center font-medium">
                                Forgot password? No worries, we'll send you
                reset instructions              {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <form onSubmit={handleSubmit(onSubmit, onError)} className="px-3">
                           {" "}
              <div className={`${styles.inputContainer}`}>
                               {" "}
                <TextInput
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  register={register}
                  required="Email is required"
                  validation={(value) =>
                    value.includes("@") || "Email is invalid"
                  }
                  className={styles.inputField}
                />
                               {" "}
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <Button
                type="submit"
                className={styles.primaryButton}
                name={
                  loading ? (
                    <>
                                           {" "}
                      <div className="flex justify-content-center">
                                               {" "}
                        <span className="font-medium">Sending...</span>         
                                     {" "}
                        <ProgressSpinner
                          style={{
                            width: "20px",
                            height: "20px",
                            stroke: "#FFFFFF",
                            fill: "white",
                          }}
                          strokeWidth="4"
                        />
                                             {" "}
                      </div>
                                         {" "}
                    </>
                  ) : (
                    "Send verification code"
                  )
                }
              />
                           {" "}
              <div>
                               {" "}
                <h1
                  className="text-center text-sm cursor-pointer"
                  onClick={() => navigate("/")}
                >
                                    <i className="fa-solid fa-arrow-left"></i>{" "}
                  Back to log in                {" "}
                </h1>
                             {" "}
              </div>
                         {" "}
            </form>
                     {" "}
          </Card>
        ) : (
          <>
                       {" "}
            {resetPassword ? (
              <Card className={styles.formCard}>
                               {" "}
                <div className="flex flex-column gap-4">
                                   {" "}
                  <h1 className="text-center">Reset your password</h1>         
                         {" "}
                  <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
                                       {" "}
                    <div className={styles.resetContainer}>
                                           {" "}
                      <label className="font-semibold text-sm w-12">
                                                New password
                        <span className="text-red-600">*</span>                 
                           {" "}
                      </label>
                                           {" "}
                      <CustomPassword
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        register={register}
                        required="New password is required"
                        className={styles.resetField}
                      />
                                         {" "}
                    </div>
                                       {" "}
                    <div className={styles.resetContainer}>
                                           {" "}
                      <label className="font-semibold text-sm w-12">
                                                Confirm password
                        <span className="text-red-600">*</span>                 
                           {" "}
                      </label>
                                           {" "}
                      <CustomPassword
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Enter password again"
                        register={register}
                        required="Confirmation password is required"
                        className={styles.resetField}
                      />
                                         {" "}
                    </div>
                                       {" "}
                    <div className="parentContainer">
                                           {" "}
                      <Button
                        type="submit"
                        className={styles.otpButton}
                        name="Reset Password"
                      />
                                         {" "}
                    </div>
                                     {" "}
                  </form>
                                 {" "}
                </div>
                             {" "}
              </Card>
            ) : (
              <Card className={styles.formCard}>
                               {" "}
                <div className="text-center flex flex-column gap-4">
                                    <h1>Enter your OTP</h1>                 {" "}
                  <p>Code has been sent to {email}</p>                 {" "}
                  <div className={styles.otpContainer}>
                                       {" "}
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)} // Add keydown handler
                        className={styles.otpInput}
                      />
                    ))}
                                     {" "}
                  </div>
                                   {" "}
                  <div className={styles.timerContainer}>
                                       {" "}
                    {timeLeft > 0 ? (
                      <p>Time left to enter OTP: {formatTime()}</p>
                    ) : (
                      <p className={styles.timerExpired}>
                                                OTP has expired. Please request
                        a new code.                      {" "}
                      </p>
                    )}
                                     {" "}
                  </div>
                                   {" "}
                  <div className="parentContainer">
                                       {" "}
                    <Button
                      type="button"
                      className={styles.otpButton}
                      name="Verify"
                      onClick={handleOtpButton}
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </Card>
            )}
                     {" "}
          </>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};
export default ForgotPassword;
