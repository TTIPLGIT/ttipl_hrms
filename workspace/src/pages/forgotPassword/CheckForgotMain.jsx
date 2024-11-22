import { Card } from "primereact/card";
import TextInput from "../../components/form/text/TextInput";
import Button from "../../components/button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setEmail, setUserId } from "./emailSlice";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import forgetPassword from "../../assests/images/forget.png";
import { unProtectedCall } from "../../services/userService";

const CheckForgotMain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    setLoading(true);
    try {
      const response = await unProtectedCall(
        "api/users/get-id-by-email",
        { email },
        "post"
      );
      if (response && response.id) {
        dispatch(setEmail(email));
        dispatch(setUserId(response.id.toString()));
        const otpResponse = await unProtectedCall(
          "api/otp/generate",
          { email },
          "post"
        );
        if (otpResponse && otpResponse.success) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Verification code sent!",
          });
          setTimeout(() => navigate("/otp"), 2000);
        } else {
          throw new Error("Failed to send verification code");
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Email ID does not exist in our records.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Could not send OTP. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <Toast ref={toast} />
      <Card className={styles.formCard}>
        <div className={styles.logoContainer}>
          <img
            src={forgetPassword}
            className="w-2 mx-auto"
            alt="Forget Password"
          />
          <h1 className="text-4xl font-bold text-center m-2">
            Reset your password
          </h1>
          <p className="text-sm text-center font-medium">
            Forgot password? No worries, we'll send you reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-3">
          <div className={styles.inputContainer}>
            <TextInput
              id="email"
              name="email"
              placeholder="Email Address"
              register={register}
              required="Email is required"
              validation={(value) => value.includes("@") || "Email is invalid"}
              className={styles.inputField}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className={styles.primaryButton}
            name={
              loading ? (
                <div className="flex justify-content-center">
                  <span className="font-medium">Sending...</span>
                  <ProgressSpinner
                    style={{
                      width: "20px",
                      height: "20px",
                      stroke: "#FFFFFF",
                      fill: "white",
                    }}
                    strokeWidth="4"
                  />
                </div>
              ) : (
                "Send verification code"
              )
            }
          />

          <div>
            <h1
              className="text-center text-sm cursor-pointer"
              onClick={() => navigate("/")}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to log in
            </h1>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CheckForgotMain;
