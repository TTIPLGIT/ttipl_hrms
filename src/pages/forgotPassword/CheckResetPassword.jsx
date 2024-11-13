import { Card } from "primereact/card";
import CustomPassword from "../../components/form/password/CustomPassword";
import Button from "../../components/button/Button";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { unProtectedCall } from "../../services/userService";
import bcrypt from "bcryptjs/dist/bcrypt";
import styles from "./styles.module.css";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearEmail, clearUserId } from "./emailSlice"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

const CheckResetPassword = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.email.userId);
  console.log("userid", userId);

  const toast = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onResetPasswordSubmit = async (data) => {
    // Hash the new password before sending it to the backend
    // const hashedPassword = bcrypt.hashSync(data.newPassword, 10); // 10 is the salt rounds
    const hashedPassword = data.newPassword;
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
      });

      // Dispatch actions to clear email and userId
      dispatch(clearEmail());
      dispatch(clearUserId());

      // Add a 2-second delay before navigating
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

  return (
    <div className={styles.outerContainer}>
      <Toast ref={toast} />

      <Card className={styles.formCard}>
        <div className="flex flex-column gap-4">
          <h1 className="text-center">Reset your password</h1>
          <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
            <div className={styles.resetContainer}>
              <label className="font-semibold text-sm w-12">
                New password
                <span className="text-red-600">*</span>
              </label>
              <CustomPassword
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                register={register}
                required="New password is required"
                className={styles.resetField}
              />
            </div>
            <div className={styles.resetContainer}>
              <label className="font-semibold text-sm w-12">
                Confirm password
                <span className="text-red-600">*</span>
              </label>
              <CustomPassword
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter password again"
                register={register}
                required="Confirmation password is required"
                className={styles.resetField}
              />
            </div>
            <div className="parentContainer">
              <Button
                type="submit"
                className={styles.otpButton}
                name="Reset Password"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CheckResetPassword;
