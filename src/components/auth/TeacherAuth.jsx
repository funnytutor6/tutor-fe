import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services/authService.js";
import { teacherService } from "../../api/services/teacherService.js";
import { uploadService } from "../../api/services/uploadService.js";
import { otpService } from "../../api/services/otpService.js";
import { validateImageFile } from "../../services/cloudinaryService";
import OtpVerification from "./OtpVerification.jsx";
import PasswordResetOTP from "./PasswordResetOTP";
import PasswordInput from "./PasswordInput";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Country codes mapping
const countryPhoneCodes = {
  "United States": "+1",
  "United Kingdom": "+44",
  Canada: "+1",
  Australia: "+61",
  Germany: "+49",
  France: "+33",
  Spain: "+34",
  Italy: "+39",
  Netherlands: "+31",
  India: "+91",
  Singapore: "+65",
  "Sri Lanka": "+94",
  Afghanistan: "+93",
  Albania: "+355",
  Algeria: "+213",
  Argentina: "+54",
  Armenia: "+374",
  Austria: "+43",
  Bangladesh: "+880",
  Belgium: "+32",
  Brazil: "+55",
  Bulgaria: "+359",
  Cambodia: "+855",
  Chile: "+56",
  China: "+86",
  Colombia: "+57",
  Croatia: "+385",
  "Czech Republic": "+420",
  Denmark: "+45",
  Egypt: "+20",
  Estonia: "+372",
  Finland: "+358",
  Ghana: "+233",
  Greece: "+30",
  Hungary: "+36",
  Indonesia: "+62",
  Iran: "+98",
  Iraq: "+964",
  Ireland: "+353",
  Israel: "+972",
  Japan: "+81",
  Jordan: "+962",
  Kazakhstan: "+7",
  Kenya: "+254",
  Kuwait: "+965",
  Latvia: "+371",
  Lebanon: "+961",
  Lithuania: "+370",
  Luxembourg: "+352",
  Malaysia: "+60",
  Maldives: "+960",
  Mexico: "+52",
  Morocco: "+212",
  Myanmar: "+95",
  Nepal: "+977",
  "New Zealand": "+64",
  Nigeria: "+234",
  Norway: "+47",
  Pakistan: "+92",
  Philippines: "+63",
  Poland: "+48",
  Portugal: "+351",
  Qatar: "+974",
  Romania: "+40",
  Russia: "+7",
  "Saudi Arabia": "+966",
  Serbia: "+381",
  Slovakia: "+421",
  Slovenia: "+386",
  "South Africa": "+27",
  "South Korea": "+82",
  Sweden: "+46",
  Switzerland: "+41",
  Thailand: "+66",
  Turkey: "+90",
  Ukraine: "+380",
  "United Arab Emirates": "+971",
  Uruguay: "+598",
  Venezuela: "+58",
  Vietnam: "+84",
  Zimbabwe: "+263",
};

const TeacherAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    cityOrTown: "",
    country: "",
    profilePhoto: null,
    profilePhotoUrl: null, // Store Cloudinary URL
  });

  // New state for country code functionality
  const [countryCode, setCountryCode] = useState("");
  const [phoneWithoutCode, setPhoneWithoutCode] = useState("");

  // State for image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const cityInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const countryInputRef = useRef(null);
  const countryAutocompleteRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // OTP verification states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [pendingLogin, setPendingLogin] = useState(null); // Store login credentials for retry after OTP

  // Update country code when country changes
  useEffect(() => {
    if (formData.country) {
      const code = countryPhoneCodes[formData.country] || "";
      setCountryCode(code);

      // Update the full phone number in formData
      if (phoneWithoutCode) {
        setFormData((prev) => ({
          ...prev,
          phoneNumber: code + phoneWithoutCode,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          phoneNumber: code,
        }));
      }
    }
  }, [formData.country, phoneWithoutCode]);

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBRVAGSgYeCWuZW_Lhy5V_bdr_0Tv1Q5ys&libraries=places`;
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            setIsGoogleMapsLoaded(true);
          }
        }, 100);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize autocomplete for city
  useEffect(() => {
    if (
      isGoogleMapsLoaded &&
      cityInputRef.current &&
      !autocompleteRef.current &&
      !isLogin
    ) {
      const initTimer = setTimeout(() => {
        if (cityInputRef.current && window.google?.maps?.places?.Autocomplete) {
          try {
            autocompleteRef.current =
              new window.google.maps.places.Autocomplete(cityInputRef.current, {
                types: ["(cities)"],
                fields: [
                  "name",
                  "formatted_address",
                  "address_components",
                  "place_id",
                ],
              });

            autocompleteRef.current.addListener("place_changed", () => {
              const place = autocompleteRef.current.getPlace();

              if (place && (place.name || place.formatted_address)) {
                let cityName = place.name || place.formatted_address;

                if (place.address_components) {
                  const cityComponent = place.address_components.find(
                    (component) =>
                      component.types.includes("locality") ||
                      component.types.includes("administrative_area_level_2") ||
                      component.types.includes("sublocality_level_1")
                  );
                  if (cityComponent) {
                    cityName = cityComponent.long_name;
                  }

                  // Auto-detect country from city selection
                  const countryComponent = place.address_components.find(
                    (component) => component.types.includes("country")
                  );
                  if (countryComponent) {
                    setFormData((prev) => ({
                      ...prev,
                      cityOrTown: cityName,
                      country: countryComponent.long_name,
                    }));
                    return;
                  }
                }

                setFormData((prev) => ({
                  ...prev,
                  cityOrTown: cityName,
                }));
              }
            });
          } catch (error) {
            console.error("Error creating city autocomplete:", error);
          }
        }
      }, 500);

      return () => clearTimeout(initTimer);
    }

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(
            autocompleteRef.current
          );
          autocompleteRef.current = null;
        } catch (error) {
          console.error("Error cleaning up city autocomplete:", error);
        }
      }
    };
  }, [isGoogleMapsLoaded, isLogin]);

  // Initialize autocomplete for country
  useEffect(() => {
    if (
      isGoogleMapsLoaded &&
      countryInputRef.current &&
      !countryAutocompleteRef.current &&
      !isLogin
    ) {
      const initTimer = setTimeout(() => {
        if (
          countryInputRef.current &&
          window.google?.maps?.places?.Autocomplete
        ) {
          try {
            countryAutocompleteRef.current =
              new window.google.maps.places.Autocomplete(
                countryInputRef.current,
                {
                  types: ["country"],
                  fields: ["name", "address_components"],
                }
              );

            countryAutocompleteRef.current.addListener("place_changed", () => {
              const place = countryAutocompleteRef.current.getPlace();

              if (place && place.name) {
                setFormData((prev) => ({
                  ...prev,
                  country: place.name,
                }));
              }
            });
          } catch (error) {
            console.error("Error creating country autocomplete:", error);
          }
        }
      }, 500);

      return () => clearTimeout(initTimer);
    }

    return () => {
      if (countryAutocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(
            countryAutocompleteRef.current
          );
          countryAutocompleteRef.current = null;
        } catch (error) {
          console.error("Error cleaning up country autocomplete:", error);
        }
      }
    };
  }, [isGoogleMapsLoaded, isLogin]);

  useEffect(() => {
    setIsLogin(location.pathname.includes("/login"));
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection and upload to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = ""; // Reset input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingImage(true);
    try {
      const result = await uploadService.uploadImage(file, "teacher-profiles");

      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
        profilePhotoUrl: result?.url, // Store Cloudinary URL
      }));

      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      toast.error("Failed to upload image: " + error.message);
      setImagePreview(null);
      e.target.value = ""; // Reset input
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle phone number change with country code logic
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Remove any non-digit characters except + at the beginning
    const cleanedValue = value.replace(/[^\d+]/g, "");

    // If user manually types a country code, extract it
    if (cleanedValue.startsWith("+")) {
      const match = cleanedValue.match(/^(\+\d{1,4})(.*)$/);
      if (match) {
        const [, code, number] = match;
        setCountryCode(code);
        setPhoneWithoutCode(number);

        // Find the country that matches this code
        const matchingCountry = Object.entries(countryPhoneCodes).find(
          ([, phoneCode]) => phoneCode === code
        );
        if (matchingCountry && matchingCountry[0] !== formData.country) {
          setFormData((prev) => ({
            ...prev,
            country: matchingCountry[0],
            phoneNumber: cleanedValue,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            phoneNumber: cleanedValue,
          }));
        }
      }
    } else {
      // If no country code, use the current country code
      setPhoneWithoutCode(cleanedValue);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: countryCode + cleanedValue,
      }));
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      throw new Error("Please fill in all required fields");
    }

    try {
      const response = await authService.loginTeacher(
        formData.email,
        formData.password
      );

      const userData = {
        id: response?.teacher.id,
        teacherId: response?.teacher.id,
        name: response?.teacher.name,
        email: response?.teacher.email,
        phoneNumber: response?.teacher.phoneNumber,
        cityOrTown: response?.teacher.cityOrTown,
        country: response?.teacher.country,
        profilePhoto: response?.teacher.profilePhoto,
        hasPremium: response?.teacher.hasPremium,
        role: "teacher",
        token: response?.token,
      };

      await login(userData);
      navigate("/dashboard/teacher");
      return response.data;
    } catch (error) {
      // Check if phone verification is required
      if (error.response?.data?.requiresOTPVerification) {
        const { userId, phoneNumber, userType } = error.response.data;
        // Store login credentials for retry after OTP verification
        setPendingLogin({
          email: formData.email,
          password: formData.password,
        });
        // Set pending registration state for OTP verification
        setPendingRegistration({
          teacherId: userId,
          teacher: {
            phoneNumber: phoneNumber,
            email: formData.email,
          },
        });
        setShowOtpVerification(true);
        // Send OTP automatically
        try {
          await otpService.sendOTP(userId, userType, phoneNumber);
          toast.success(
            "OTP sent to your WhatsApp. Please verify to continue."
          );
        } catch (otpError) {
          toast.error("Failed to send OTP. Please try again.");
        }
        return null; // Prevent navigation
      }
      throw error; // Re-throw other errors
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      throw new Error("Please fill in name, email and password");
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }


    // Validate phone number is provided
    const phoneNumber =
      formData.phoneNumber && formData.phoneNumber !== countryCode
        ? formData.phoneNumber
        : null;

    if (!phoneNumber) {
      throw new Error("Phone number is required for verification");
    }

    // Send data as JSON with Cloudinary URL
    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: phoneNumber,
      cityOrTown: formData.cityOrTown || null,
      country: formData.country || null,
      profilePhotoUrl: formData.profilePhotoUrl, // Send Cloudinary URL
    };

    const response = await authService.registerTeacher(registerData);

    // Check if OTP verification is required
    if (response.requiresOTPVerification) {
      // Store registration data for later completion
      setPendingRegistration({
        teacherId: response.teacherId,
        teacher: response.teacher,
      });
      setShowOtpVerification(true);
      return null; // Don't login yet
    }

    // If no OTP required (shouldn't happen with new flow), proceed with login
    const teacherData = response?.teacher;
    const userData = {
      id: teacherData.id,
      teacherId: teacherData.id,
      name: teacherData.name,
      email: teacherData.email,
      phoneNumber: teacherData.phoneNumber,
      cityOrTown: teacherData.cityOrTown,
      country: teacherData.country,
      profilePhoto: teacherData.profilePhoto,
      role: "teacher",
      token: response?.token,
    };

    await login(userData);
    return response;
  };

  // Handle OTP verification success
  const handleOtpVerificationSuccess = async () => {
    if (!pendingRegistration) {
      throw new Error("No pending registration found");
    }

    try {
      // If this is a login flow (pendingLogin exists), retry login
      if (pendingLogin) {
        const response = await authService.loginTeacher(
          pendingLogin.email,
          pendingLogin.password
        );

        const userData = {
          id: response?.teacher.id,
          teacherId: response?.teacher.id,
          name: response?.teacher.name,
          email: response?.teacher.email,
          phoneNumber: response?.teacher.phoneNumber,
          cityOrTown: response?.teacher.cityOrTown,
          country: response?.teacher.country,
          profilePhoto: response?.teacher.profilePhoto,
          hasPremium: response?.teacher.hasPremium,
          role: "teacher",
          token: response?.token,
        };

        await login(userData);
        toast.success("Phone verified! Login successful!");
        setShowOtpVerification(false);
        setPendingRegistration(null);
        setPendingLogin(null);
        navigate("/dashboard/teacher");
        return;
      }

      // Otherwise, complete registration after OTP verification
      const response = await authService.completeTeacherRegistration(
        pendingRegistration.teacherId
      );

      const teacherData = response.teacher;
      const userData = {
        id: teacherData.id,
        teacherId: teacherData.id,
        name: teacherData.name,
        email: teacherData.email,
        phoneNumber: teacherData.phoneNumber,
        cityOrTown: teacherData.cityOrTown,
        country: teacherData.country,
        profilePhoto: teacherData.profilePhoto,
        role: "teacher",
        token: response.token,
        hasPremium: teacherData.hasPremium,
      };

      await login(userData);
      toast.success("Registration completed successfully!");
      setShowOtpVerification(false);
      setPendingRegistration(null);
      navigate("/dashboard/teacher");
    } catch (error) {
      console.error("Error completing registration/login:", error);
      toast.error(
        error.response?.data?.error || "Failed to complete registration/login"
      );
    }
  };

  // Handle change phone number (go back to registration form)
  const handleChangePhone = () => {
    setShowOtpVerification(false);
    setPendingRegistration(null);
    toast.info("Please update your phone number and try again");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        const result = await handleRegister();
        // Only navigate if registration completed (no OTP required)
        // If OTP is required, handleRegister returns null and OTP component will show
        if (result !== null) {
          navigate("/dashboard/teacher");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .auth-card {
      border: none;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
    }

    .auth-input-group-text {
      background-color: #f8f9fa;
      border-color: #dee2e6;
      color: #6c757d;
      border-radius: 8px 0 0 8px;
    }

    .auth-form-control {
      border-radius: 0 8px 8px 0;
      padding: 12px 15px;
      border-left: none;
    }

    .auth-form-control:focus {
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
      border-color: #86b7fe;
    }

    .auth-input-group:focus-within .auth-input-group-text {
      border-color: #86b7fe;
      background-color: #e7f1ff;
      color: #0d6efd;
    }

    .country-code-display {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px 0 0 8px;
      padding: 12px 15px;
      color: #0d6efd;
      font-weight: 600;
      display: flex;
      align-items: center;
      min-width: 80px;
      justify-content: center;
    }

    .phone-input-with-code {
      border-radius: 0 8px 8px 0;
      border-left: none;
    }

    .auth-btn-primary {
      border-radius: 8px;
      padding: 12px 20px;
      font-weight: 500;
      background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
      border: none;
      transition: all 0.3s ease;
    }

    .auth-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
    }

    .pac-container {
      background-color: white !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      border: 1px solid #dee2e6 !important;
      margin-top: 2px !important;
      font-family: inherit !important;
      z-index: 9999 !important;
    }

    .pac-item {
      padding: 12px 15px !important;
      border-bottom: 1px solid #f1f3f4 !important;
      cursor: pointer !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
    }

    .pac-item:hover {
      background-color: #f8f9fa !important;
    }

    .pac-item-selected,
    .pac-item:hover {
      background-color: #e7f1ff !important;
    }

    .pac-matched {
      font-weight: 600 !important;
      color: #0d6efd !important;
    }

    .pac-item-query {
      color: #212529 !important;
      font-size: 14px !important;
    }

    .pac-icon {
      margin-right: 10px !important;
      margin-top: 2px !important;
    }

    .pac-logo::after {
      display: none !important;
    }

    @media (max-width: 768px) {
      .auth-container {
        padding: 0 15px;
      }
      
      .auth-card-body {
        padding: 2rem !important;
      }
    }
  `;

  // Show OTP verification if registration was successful
  if (showOtpVerification && pendingRegistration) {
    return (
      <OtpVerification
        userId={pendingRegistration.teacherId}
        userType="teacher"
        phoneNumber={pendingRegistration.teacher.phoneNumber}
        onVerificationSuccess={handleOtpVerificationSuccess}
        onChangePhone={handleChangePhone}
        redirectPath="/dashboard/teacher"
      />
    );
  }

  // Show password reset OTP if forgot password is clicked
  if (showForgotPassword) {
    return (
      <PasswordResetOTP
        email={formData.email || ""}
        userType="teacher"
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container mt-5 auth-container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow auth-card">
              <div className="card-body p-5 auth-card-body">
                <div className="text-center mb-4">
                  <i className="bi bi-person-workspace display-4 text-primary mb-3"></i>
                  <h2 className="fw-bold">
                    {isLogin ? "Tutor Login" : "Tutor Registration"}
                  </h2>
                  <p className="text-muted">
                    {isLogin
                      ? "Welcome back! Please login to your account."
                      : "Create your Tutor account to start offering lessons"}
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="input-group auth-input-group">
                      <span className="input-group-text auth-input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control auth-form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label htmlFor="password" className="form-label mb-0">
                        Password <span className="text-danger">*</span>
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setShowForgotPassword(true)}
                          style={{
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <PasswordInput
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={
                        isLogin
                          ? "Enter your password"
                          : "Create a password (min 6 characters)"
                      }
                      required
                      useInputGroup={true}
                      iconClass="bi bi-lock"
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                          useInputGroup={true}
                          iconClass="bi bi-lock-fill"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group auth-input-group">
                          <span className="input-group-text auth-input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control auth-form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="country" className="form-label">
                          Country <span className="text-danger">*</span>
                        </label>
                        <input
                          ref={countryInputRef}
                          type="text"
                          className="form-control mb-2"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Start typing your country..."
                          autoComplete="off"
                          required
                        />
                        <div className="form-text mb-2">
                          <i className="bi bi-info-circle me-1"></i>
                          Start typing or select from dropdown below
                        </div>

                        <select
                          className="form-select"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                        >
                          <option value="">
                            Or select from popular countries
                          </option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Spain">Spain</option>
                          <option value="Italy">Italy</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="India">India</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                          Phone Number <span className="text-danger">*</span>
                          {countryCode && (
                            <span className="text-muted ms-2">
                              ({countryCode})
                            </span>
                          )}
                        </label>
                        <div className="input-group">
                          {countryCode ? (
                            <span className="country-code-display">
                              {countryCode}
                            </span>
                          ) : (
                            <span className="input-group-text auth-input-group-text">
                              <i className="bi bi-telephone"></i>
                            </span>
                          )}
                          <input
                            type="tel"
                            className={`form-control ${countryCode
                              ? "phone-input-with-code"
                              : "auth-form-control"
                              }`}
                            id="phoneNumber"
                            name="phoneNumber"
                            value={
                              countryCode
                                ? phoneWithoutCode
                                : formData.phoneNumber
                            }
                            onChange={handlePhoneChange}
                            placeholder={
                              countryCode
                                ? "Enter phone number"
                                : "Select country first or enter with country code"
                            }
                            required
                          />
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          {countryCode
                            ? `Enter your phone number. Country code ${countryCode} will be added automatically.`
                            : "Select your country first to automatically add the country code, or enter the full number with country code."}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="cityOrTown" className="form-label">
                          City or Town <span className="text-danger">*</span>
                        </label>
                        <div className="input-group auth-input-group">
                          <span className="input-group-text auth-input-group-text">
                            <i className="bi bi-geo-alt"></i>
                          </span>
                          <input
                            ref={cityInputRef}
                            type="text"
                            className="form-control auth-form-control"
                            id="cityOrTown"
                            name="cityOrTown"
                            value={formData.cityOrTown}
                            onChange={handleChange}
                            placeholder="Start typing your city or town..."
                            required
                            autoComplete="off"
                          />
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Start typing to see city suggestions
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="profilePhoto" className="form-label">
                          Profile Photo <span className="text-danger"></span>
                        </label>

                        {/* Image preview */}
                        {imagePreview && (
                          <div className="mb-2 text-center">
                            <img
                              src={imagePreview}
                              alt="Profile preview"
                              className="img-thumbnail"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                            {uploadingImage && (
                              <div className="mt-2">
                                <div
                                  className="spinner-border spinner-border-sm text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Uploading...
                                  </span>
                                </div>
                                <span className="ms-2 text-muted">
                                  Uploading to cloud...
                                </span>
                              </div>
                            )}
                            {formData.profilePhotoUrl && !uploadingImage && (
                              <div className="mt-2 text-success">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Image uploaded successfully!
                              </div>
                            )}
                          </div>
                        )}

                        <input
                          type="file"
                          className="form-control"
                          id="profilePhoto"
                          name="profilePhoto"
                          onChange={handleImageChange}
                          accept="image/*"
                          required
                          disabled={uploadingImage}
                        />
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Upload a profile picture (Max 5MB, JPG, PNG, GIF,
                          WebP). Image will be uploaded immediately upon
                          selection.
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 auth-btn-primary"
                    disabled={loading || uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploading image...
                      </>
                    ) : loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isLogin ? "Logging in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        <i
                          className={`bi ${isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"
                            } me-2`}
                        ></i>
                        {isLogin ? "Login" : "Create Account"}
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() =>
                        navigate(
                          isLogin ? "/register/teacher" : "/login/teacher"
                        )
                      }
                    >
                      {isLogin ? "Register here" : "Login here"}
                    </button>
                  </p>
                </div>

                <div className="mt-4">
                  <div className="alert alert-info" role="alert">
                    <div className="d-flex">
                      <i className="bi bi-lightbulb flex-shrink-0 me-2"></i>
                      <div>
                        <h6 className="alert-heading mb-1">For Teachers</h6>
                        <small>
                          {isLogin
                            ? "Login to access your Tutor dashboard and manage your tutoring services."
                            : "Join our platform to offer tutoring services and connect with students looking for help."}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherAuth;
