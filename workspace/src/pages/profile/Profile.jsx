import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import defaultImage from "../../assests/images/loginBg.png";
import TextInput from "../../components/form/text/TextInput";
import CustomPassword from "../../components/form/password/CustomPassword";
import { selectUserData } from "../login/loginSlice";

const Profile = () => {
  const navigate = useNavigate();
  const defaultAvatar = defaultImage;
  const user = useSelector(selectUserData);
  console.log(user,'everyone')
  const [avatar, setAvatar] = React.useState(user?.avatar || defaultAvatar);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseProfile = () => {
    navigate("/user/list");
  };

  const {
    firstName,
    lastName,
    middleName,
    gender,
    phoneNumber,
    email,
    password,
  } = user || {};

  const fullName = `${firstName || ''} ${lastName || ''}`;

  return (
    <div className={styles.profilePage}>
      <div className={styles.backgroundImage}></div>

      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            <img
              src={avatar}
              alt={`${fullName} avatar`}
              className={styles.avatar}
            />
            <label htmlFor="fileInput" className={styles.cameraIcon}>
              <i className="pi pi-camera"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.name}>{fullName}</h2>
            <p className={styles.title}>{email || ''}</p>
            <p className={styles.detail}>Detail 1</p>
            <p className={styles.detail}>Detail 2</p>
            <p className={styles.detail}>Detail 3</p>
          </div>
        </div>
        <div className={styles.formCard}>
          <h4 className={styles.formTitle}>ACCOUNT</h4>

          <div className={styles.formGroupGrid}>
            <div className={styles.formGroup}>
              <TextInput
                id="firstName"
                name="firstName"
                defaultValue={firstName || ''}
                labelText="First Name"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                id="lastName"
                name="lastName"
                defaultValue={lastName || ''}
                labelText="Last Name"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                id="middleName"
                name="middleName"
                defaultValue={middleName || ''}
                labelText="Middle Name"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                id="gender"
                name="gender"
                defaultValue={gender || ''}
                labelText="Gender"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={phoneNumber || ''}
                labelText="Phone Number"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                id="email"
                name="email"
                defaultValue={email || ''}
                labelText="Email Address"
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <CustomPassword
                id="password"
                name="password"
                labelText="Password"
                defaultValue={password || ''}
                register={() => ({})}
                className={styles.inputField}
                readOnly
              />
            </div>
          </div>
          <div className={styles.editButtonWrapper}>
            <button className={styles.editButton}>EDIT</button>
            <button className={styles.closeButton} onClick={handleCloseProfile}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
