import { Card } from "primereact/card";
import CustomPassword from "../../components/form/password/CustomPassword";
import Button from "../../components/button/Button";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { unProtectedCall } from "../../services/userService";
import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Import navigate from react-router-dom
import { Toast } from "primereact/toast"; // Make sure to import Toast

const ResetScreen = () => {
  const userr = useSelector((state) => state.email.email);
  const userId = useSelector((state) => state.email.userId);
  const toast = useRef(null);
  const navigate = useNavigate(); // Initialize navigate from react-router
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    console.log("Email in ResetScreen:", userr);
    console.log("User ID in ResetScreen:", userId);
  }, [userr, userId]); // Log whenever userr or userId changes

  const onResetPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match!",
      });
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      await unProtectedCall(
        "api/users/update-password",
        { userId: userId, newPassword: data.newPassword }, // Send plain password
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password has been reset successfully!",
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/"); // Redirect to home or desired route
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password reset failed!",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Toast ref={toast} /> {/* Toast for notifications */}
      <Card className={styles.formCard}>
        <div className="flex flex-column gap-4">
          <h1 className="text-center">Reset your password</h1>
          <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
            <div className={styles.resetContainer}>
              <label className="font-semibold text-sm w-12">
                New password<span className="text-red-600">*</span>
              </label>
              <CustomPassword
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                register={register}
                required="New password is required"
                className={styles.resetField}
              />
              {errors.newPassword && (
                <p className="text-red-600">{errors.newPassword.message}</p>
              )}
            </div>
            <div className={styles.resetContainer}>
              <label className="font-semibold text-sm w-12">
                Confirm password<span className="text-red-600">*</span>
              </label>
              <CustomPassword
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter password again"
                register={register}
                required="Confirmation password is required"
                className={styles.resetField}
              />
              {errors.confirmPassword && (
                <p className="text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="parentContainer">
              <Button
                type="submit"
                className={styles.otpButton}
                name={loading ? "Resetting..." : "Reset Password"} // Show loading state
                disabled={loading} // Disable button while loading
              />
            </div>
          </form>
        </div>
      </Card>
    </>
  );
};

export default ResetScreen;
