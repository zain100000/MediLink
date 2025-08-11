import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./authCss/Signup.css";
import Logo from "../../assets/logo/logo.png";
import InputField from "../../utils/customInputField/InputField";
import Button from "../../utils/customButton/Button";
import {
  validateEmail,
  validatePassword,
  validateFullName,
} from "../../utils/customValidations/Validations";
import imgPlaceholder from "../../assets/placeholders/img-placeholder.png";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { register } from "../../redux/slices/authSlice";

// Validation for all fields
const validateFields = (fields) => {
  const errors = {};

  if (!fields.fullName?.trim()) errors.fullName = "Full name is required.";
  else {
    const fullNameErr = validateFullName(fields.fullName);
    if (fullNameErr) errors.fullName = fullNameErr;
  }

  if (!fields.email?.trim()) errors.email = "Email is required.";
  else {
    const emailErr = validateEmail(fields.email);
    if (emailErr) errors.email = emailErr;
  }

  if (!fields.password) errors.password = "Password is required.";
  else {
    const passErr = validatePassword(fields.password);
    if (passErr) errors.password = passErr;
  }

  if (!fields.phone?.trim()) errors.phone = "Phone number is required.";
  if (!fields.address?.trim()) errors.address = "Address is required.";
  if (!fields.speciality?.trim()) errors.speciality = "Speciality is required.";
  if (!fields.experience?.trim()) errors.experience = "Experience is required.";
  if (!fields.department?.trim()) errors.department = "Department is required.";
  if (!fields.qualification?.trim())
    errors.qualification = "Qualification is required.";
  if (!fields.consultationFee?.trim())
    errors.consultationFee = "Consultation Fee is required.";

  return errors;
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [experience, setExperience] = useState("");
  const [department, setDepartment] = useState("");
  const [qualification, setQualification] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  const [loading, setLoading] = useState(false);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // This is just tracking errors
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
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const fields = {
      fullName,
      email,
      password,
      phone,
      address,
      speciality,
      department,
      qualification,
      experience,
      consultationFee, // also make sure state exists
    };

    const errors = validateFields(fields);
    if (Object.keys(errors).length > 0) {
      toast.error(errors[Object.keys(errors)[0]]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);    
    formData.append("address", address);
    formData.append("specialization", speciality);

    // These must be arrays in the backend
    formData.append("departments", JSON.stringify([department]));
    formData.append("qualifications", JSON.stringify([qualification]));

    formData.append("experience", experience);
    formData.append("consultationFee", Number(consultationFee));

    if (fileInputRef.current.files[0]) {
      formData.append("profilePicture", fileInputRef.current.files[0]);
    }

    try {
      const resultAction = await dispatch(register(formData));

      if (register.fulfilled.match(resultAction)) {
        toast.success("Register Successfully, wait for admin approval!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(
          resultAction.payload?.error || "Register failed. Please try again."
        );
      }
    } catch {
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
                  <img src={Logo} className="logo" alt="logo" />
                </div>

                <form className="form-container">
                  {/* Profile Picture */}
                  <div className="img-container">
                    <div
                      className="image-placeholder-container"
                      onClick={handleImageClick}
                      style={{ cursor: "pointer" }}
                    >
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Profile"
                          className="image"
                        />
                      ) : (
                        <img
                          src={imgPlaceholder}
                          alt="Placeholder"
                          className="image"
                        />
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageSelect}
                      />
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="form-grid">
                    <div>
                      <label className="label">Name</label>
                      <InputField
                        label="Enter Name"
                        type="text"
                        editable={true}
                        value={fullName}
                        onChange={handleFullNameChange}
                      />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <InputField
                        label="Enter Email"
                        type="text"
                        editable={true}
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div>
                      <label className="label">Password</label>
                      <InputField
                        label="Enter Password"
                        type="password"
                        editable={true}
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <InputField
                        label="Enter Phone Number"
                        type="text"
                        editable={true}
                        value={phone}
                        onChange={setPhone}
                      />
                    </div>
                    <div>
                      <label className="label">Address</label>
                      <InputField
                        label="Enter Address"
                        type="text"
                        editable={true}
                        value={address}
                        onChange={setAddress}
                      />
                    </div>
                    <div>
                      <label className="label">Speciality</label>
                      <InputField
                        label="Enter Speciality"
                        type="text"
                        editable={true}
                        value={speciality}
                        onChange={setSpeciality}
                      />
                    </div>
                    <div>
                      <label className="label">Experience</label>
                      <InputField
                        label="Enter Experience"
                        type="text"
                        editable={true}
                        value={experience}
                        onChange={setExperience}
                      />
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <InputField
                        label="Enter Department"
                        type="text"
                        editable={true}
                        value={department}
                        onChange={setDepartment}
                      />
                    </div>
                    <div>
                      <label className="label">Qualification</label>
                      <InputField
                        label="Enter Qualification"
                        type="text"
                        editable={true}
                        value={qualification}
                        onChange={setQualification}
                      />
                    </div>
                    <div>
                      <label className="label">Consultation Fee</label>
                      <InputField
                        label="Enter Consultation Fee"
                        type="text"
                        editable={true}
                        value={consultationFee}
                        onChange={setConsultationFee}
                      />
                    </div>
                  </div>

                  {/* Signup Button */}
                  <div className="btn-container">
                    <Button
                      title="Signup"
                      width={"100%"}
                      onPress={handleSignup}
                      loading={loading}
                    />
                  </div>

                  {/* Signin Link */}
                  <div className="signin-container">
                    <label className="label">Already have an account?</label>
                    <NavLink to="/" className="signin-label">
                      Signin
                    </NavLink>
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
