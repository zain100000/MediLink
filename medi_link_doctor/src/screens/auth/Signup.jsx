import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./authCss/Signup.css";
import Logo from "../../assets/logo/logo.png";
import InputField from "../../utils/customInputField/InputField";
import Button from "../../utils/customButton/Button";
import {
  validateEmail,
  validatePassword,
  validateFields,
  validateFullName,
} from "../../utils/customValidations/Validations";
import imgPlaceholder from "../../assets/placeholders/img-placeholder.png";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { register } from "../../redux/slices/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const hasErrors =
      fullNameError ||
      emailError ||
      passwordError ||
      !fullName ||
      !email ||
      !password;
  }, [fullNameError, emailError, passwordError, fullName, email, password]);

  const handleFullNameChange = (value) => {
    setFullName(value);
    setFullNameError(validateFullName(value));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const fields = { fullName, email, password };
    const errors = validateFields(fields);
    const errorKeys = Object.keys(errors);

    if (errorKeys.length > 0) {
      toast.error(errors[errorKeys[0]]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    if (fileInputRef.current.files[0]) {
      formData.append("profilePicture", fileInputRef.current.files[0]);
    }

    try {
      const resultAction = await dispatch(register(formData));

      if (register.fulfilled.match(resultAction)) {
        toast.success(
          "Register Successfully, wait for admin approval!"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorMessage =
          register.rejected.match(resultAction) && resultAction.payload
            ? resultAction.payload.error || "Register failed. Please try again."
            : "Unexpected response from server.";

        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup-screen">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-12 col-lg-6">
            <div className="card">
              <div className="card-body">
                <div className="logo-container">
                  <img src={Logo} className="logo" />
                </div>

                <form className="form-container">
                  <div className="img-container">
                    <div className="image-placeholder-container">
                      <div
                        onClick={handleImageClick}
                        style={{ cursor: "pointer" }}
                      >
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Image"
                            className="image"
                          />
                        ) : (
                          <img
                            src={imgPlaceholder}
                            alt="Placeholder"
                            className="image"
                          />
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageSelect}
                      />
                    </div>
                  </div>

                  <div className="name-container">
                    <label className="label">Name</label>
                    <InputField
                      label="Enter Name"
                      type="text"
                      editable={true}
                      value={fullName}
                      onChange={handleFullNameChange}
                    />
                  </div>

                  <div className="email-container">
                    <label className="label">Email</label>
                    <InputField
                      label="Enter Email"
                      type="text"
                      editable={true}
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>

                  <div className="password-container">
                    <label className="label">Password</label>
                    <InputField
                      label="Enter Password"
                      type="password"
                      secureTextEntry={true}
                      editable={true}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="btn-container">
                    <Button
                      title="Signup"
                      width={"100%"}
                      onPress={handleSignup}
                      loading={loading}
                    />
                  </div>

                  <div className="signin-container">
                    <div className="left-container">
                      <label className="label">Already have an account?</label>
                    </div>
                    <div className="right-container">
                      <NavLink to="/" className="signin-label">
                        Signin
                      </NavLink>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
