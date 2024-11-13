import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { Card } from "primereact/card";
import Button from "../../components/button/Button";
import TextInput from "../../components/form/text/TextInput";
import CustomPassword from "../../components/form/password/CustomPassword";
import { useForm } from "react-hook-form";
import { isEmailValid } from "../../utils/helper";
import { selectLoggedUser, generateAccessToken } from "../login/loginSlice";
import { Toast } from "primereact/toast";
import { unProtectedCall } from "../../services/userService";
import login from "../../assests/images/login.jpg";
import logo from "../../assests/images/hrmslogo.png";
import bcrypt from "bcryptjs"; // Import bcrypt

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectLoggedUser);
  const success = useSelector((selector) => selector.login.success);
  const error = useSelector((selector) => selector.login.error); // Extract the error from Redux
  // console.log("error from up", error);

  useEffect(() => {
    if (success) {
      navigate("/landing_page");
      // navigate("/dashboard");
      // navigate("/asset/list");
    }
  }, [success, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const onSubmit = async (data) => {
    // const hashedPassword = bcrypt.hashSync(data.password, 10); // 10 is the salt rounds
    const formData = data;
    // console.log(formData);

    try {
      const ress = await dispatch(
        generateAccessToken({ unProtectedCall, formData })
      );
      if (ress.error.message === "username or password is wrong") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: ress.error.message,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid email or password",
        });
      }
    } catch (error) {
      console.log("Caught error", error);
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

  return (
    <div className={styles.outerContainer}>
      <Toast ref={toast} />
      <div className={styles.loginContainer}>
        <Card className={styles.formCard}>
          <div className={styles.formContent}>
            <div className="flex justify-content-cente">
              <img src={logo} className="w-3 " />
            </div>
            <div className="">
              <h2 className="font-bold m-0 text-4xl pb-3">Sign in</h2>
              <p className="font-medium text-sm pb-5 m-0">
                Welcome back! Please enter your details
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className={styles.inputContainer}>
                <label className="font-semibold text-sm">
                  Email<span className="text-red-600">*</span>
                </label>
                <TextInput
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  register={register}
                  required="Email is required"
                  validation={(e) => isEmailValid(e) || "Email is invalid"}
                  className={styles.inputField}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
              <div className={styles.inputContainer}>
                <label className="font-semibold text-sm">
                  Password<span className="text-red-600">*</span>
                </label>
                <CustomPassword
                  id="password"
                  name="password"
                  placeholder="Password"
                  register={register}
                  required="Password is required"
                  // validation={(e) => e.length > 7 || "Password is invalid"}
                  className={styles.inputField}
                />
                {errors.password && (
                  <p className={styles.error}>{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className={styles.signInButton}
                name="Sign in"
              />
              <div className={styles.forgotPassword}>
                <a
                  href="#/forgot-password"
                  className="text-xs font-semibold"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot your password?
                </a>
              </div>
            </form>
            {/* <div className={styles.signUpText}>
                <p className="text-left">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="text-sm font-bold"
                    onClick={handleSignUpClick}
                  >
                    Sign up
                  </a>
                </p>
              </div> */}
          </div>
        </Card>
        <div className={styles.imageContainer}>
          <img src={login} alt="Login" className="p-1" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
