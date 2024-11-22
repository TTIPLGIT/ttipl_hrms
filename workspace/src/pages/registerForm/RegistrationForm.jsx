import  { useState } from "react";
import { Card } from "primereact/card";
import styles from "./styles.module.css";
import Button from '../../components/button/Button'; 
import TextInput from "../../components/form/text/TextInput";
import CustomPassword from "../../components/form/password/CustomPassword"; 

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.registrationContainer}>
        <Card className={styles.formCard}>
          <div className={styles.logoContainer}>
            <h2>AllyIQ</h2>
          </div>
          <h4>CREATE ACCOUNT</h4>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <TextInput
                id="name"
                name="name"
                placeholder="John Doe"
                // labelText="Name"
                register={() => {}}
                required="true"
                validation={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputContainer}>
              <TextInput
                id="email"
                name="email"
                placeholder="Your Email"
                // labelText="Email"
                register={() => {}}
                required="true"
                validation={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputContainer}>
              <CustomPassword
                id="password"
                name="password"
                placeholder="Password"
                // labelText="Password"
                register={() => {}}
                required="true"
                validation={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputContainer}>
              <CustomPassword
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                // labelText="Confirm Password"
                register={() => {}}
                required="true"
                validation={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
              />
              <p style={{ margin: '0px' }}>
                I agree all statements in{" "}
                <a href="#" className={styles.termsLink}>
                  Terms of service
                </a>
              </p>
            </div>
            <Button
              type="submit"
              className={styles.signUpButton}
              name="SIGN UP"
            />
          </form>
          <div className={styles.loginText}>
            <p>
              Have already an account?{" "}
              <a href="/" className={styles.loginLink}>
                Login here
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
