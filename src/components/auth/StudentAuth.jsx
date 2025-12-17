import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services/authService.js";
import { studentService } from "../../api/services/studentService.js";
import { uploadService } from "../../api/services/uploadService.js";
import { otpService } from "../../api/services/otpService.js";
import { validateImageFile } from "../../services/cloudinaryService";
import OtpVerification from "./OtpVerification.jsx";
import PasswordResetOTP from "./PasswordResetOTP";
import PasswordInput from "./PasswordInput";
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

const StudentAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [pendingLogin, setPendingLogin] = useState(null); // Store login credentials for retry after OTP
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    location: "",
    country: "",
    profilePhoto: null,
    profilePhotoUrl: "", // Cloudinary URL
  });

  // New state for country code
  const [countryCode, setCountryCode] = useState("");
  const [phoneWithoutCode, setPhoneWithoutCode] = useState("");

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Google Places API setup (only for country selection)
  const countryInputRef = useRef(null);
  const countryAutocompleteRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-navigate when user state changes
  useEffect(() => {
    if (user && user.role === "student") {
      console.log("User logged in, navigating to dashboard...");
      navigate("/dashboard/student", { replace: true });
    }
  }, [user, navigate]);

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

  // Load Google Maps API
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

      script.onerror = () => console.error("Failed to load Google Maps API");
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  // Location autocomplete removed - students can now type their town/district manually

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
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle phone number change separately
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

  // Handle image change with Cloudinary upload
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
      console.log("📤 Uploading image to Cloudinary...");
      const result = await uploadService.uploadImage(file, "student-profiles");

      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
        profilePhotoUrl: result.url, // Store Cloudinary URL
      }));

      console.log("✅ Image uploaded successfully:", result.url);
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

  // Student login function
  const handleStudentLogin = async () => {
    if (!formData.email || !formData.password) {
      throw new Error("Please enter your email address and password");
    }

    try {
      const response = await authService.loginStudent(
        formData.email,
        formData.password
      );

      if (!response.success) {
        throw new Error(response.error || "Login failed");
      }

      const student = response.student;
      const userData = {
        studentId: student.id,
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        location: student.cityOrTown,
        country: student.country,
        profilePhoto: student.profilePhoto,
        role: "student",
        token: response.token,
        hasPremium: student.hasPremium,
      };

      await login(userData);
      return userData;
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
          studentId: userId,
          student: {
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

  // Student registration function
  const handleStudentRegister = async () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.country
    ) {
      throw new Error(
        "Please fill in all required fields (Name, Email, Password, Country)"
      );
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
      country: formData.country,
      phoneNumber: phoneNumber,
      cityOrTown: formData.location || null,
      profilePhotoUrl: formData.profilePhotoUrl || null, // Send Cloudinary URL
    };

    const response = await authService.registerStudent(registerData);

    // Check if OTP verification is required
    if (response.requiresOTPVerification) {
      // Store registration data for later completion
      setPendingRegistration({
        studentId: response.studentId,
        student: response.student,
      });
      setShowOtpVerification(true);
      return null; // Don't login yet
    }

    // If no OTP required (shouldn't happen with new flow), proceed with login
    const studentData = response?.student;
    const userData = {
      studentId: studentData.id,
      name: studentData.name,
      email: studentData.email,
      phoneNumber: studentData.phoneNumber,
      location: studentData.cityOrTown,
      country: studentData.country,
      profilePhoto: studentData.profilePhoto,
      role: "student",
      token: response.token,
    };

    await login(userData);
    return userData;
  };

  // Handle OTP verification success
  const handleOtpVerificationSuccess = async () => {
    if (!pendingRegistration) {
      throw new Error("No pending registration found");
    }

    try {
      // If this is a login flow (pendingLogin exists), retry login
      if (pendingLogin) {
        const response = await authService.loginStudent(
          pendingLogin.email,
          pendingLogin.password
        );

        if (!response.success) {
          throw new Error(response.error || "Login failed");
        }

        const student = response.student;
        const userData = {
          studentId: student.id,
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber,
          location: student.cityOrTown,
          country: student.country,
          profilePhoto: student.profilePhoto,
          role: "student",
          token: response.token,
          hasPremium: student.hasPremium,
        };

        await login(userData);
        toast.success("Phone verified! Login successful!");
        setShowOtpVerification(false);
        setPendingRegistration(null);
        setPendingLogin(null);
        navigate("/dashboard/student");
        return;
      }

      // Otherwise, complete registration after OTP verification
      const response = await authService.completeStudentRegistration(
        pendingRegistration.studentId
      );

      const studentData = response.student;
      const userData = {
        studentId: studentData.id,
        name: studentData.name,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber,
        location: studentData.cityOrTown,
        country: studentData.country,
        profilePhoto: studentData.profilePhoto,
        role: "student",
        token: response.token,
        hasPremium: studentData.hasPremium,
      };

      await login(userData);
      toast.success("Registration completed successfully!");
      setShowOtpVerification(false);
      setPendingRegistration(null);
      navigate("/dashboard/student");
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
        console.log("Attempting student login...");
        await handleStudentLogin();
        console.log("Login successful, AuthContext will update user state");
      } else {
        console.log("Attempting student registration...");
        await handleStudentRegister();
        console.log(
          "Registration successful, AuthContext will update user state"
        );
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error?.response?.data?.error?.includes("verify")) {
        setShowOtpVerification(true);
      }
      const errorMessage =
        error.response?.data?.error || error.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading if AuthContext is still loading
  if (authLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show password reset OTP if forgot password is clicked
  if (showForgotPassword) {
    return (
      <PasswordResetOTP
        email={formData.email || ""}
        userType="student"
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  // Show OTP verification if registration was successful
  if (showOtpVerification && pendingRegistration) {
    return (
      <OtpVerification
        userId={pendingRegistration.studentId}
        userType="student"
        phoneNumber={pendingRegistration.student.phoneNumber}
        onVerificationSuccess={handleOtpVerificationSuccess}
        onChangePhone={handleChangePhone}
        redirectPath="/dashboard/student"
      />
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  {isLogin ? "Student Login" : "Student Registration"}
                </h2>
                <p className="text-muted">
                  {isLogin
                    ? "Welcome back! Enter your email and password to access your account."
                    : "Create your student account to start learning"}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
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
                        {countryCode && (
                          <span className="input-group-text bg-light">
                            <strong>{countryCode}</strong>
                          </span>
                        )}
                        <input
                          type="tel"
                          className="form-control"
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
                      <label htmlFor="location" className="form-label">
                        Town/District
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter your town or district"
                        autoComplete="off"
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        Enter your town or district name
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="profilePhoto" className="form-label">
                        Profile Photo
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
                        disabled={uploadingImage}
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        Optional: Upload a profile picture (Max 5MB, JPG, PNG,
                        GIF, WebP). Image will be uploaded immediately upon
                        selection.
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
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
                      isLogin ? "Enter your password" : "Create a password"
                    }
                    required
                    className="form-control"
                  />
                  {!isLogin && (
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Password must be at least 6 characters long
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
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
                        className={`bi ${
                          isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"
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
                      navigate(isLogin ? "/register/student" : "/login/student")
                    }
                  >
                    {isLogin ? "Register here" : "Login here"}
                  </button>
                </p>
              </div>

              <div className="alert alert-info mt-3" role="alert">
                <i className="bi bi-info-circle-fill me-2"></i>
                <small>
                  {isLogin
                    ? "Enter your registered email address and password to access your account."
                    : "Fill in your details to create a student profile and start learning."}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border: none;
          border-radius: 15px;
        }

        .form-control,
        .form-select {
          border-radius: 8px;
          padding: 10px 15px;
          border: 1px solid #dee2e6;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          border-color: #86b7fe;
        }

        .input-group-text {
          border-radius: 8px 0 0 8px;
          border: 1px solid #dee2e6;
          background-color: #f8f9fa;
          color: #0d6efd;
          font-weight: 600;
        }

        .input-group .form-control {
          border-radius: 0 8px 8px 0;
          border-left: 0;
        }

        .btn-primary {
          border-radius: 8px;
          padding: 12px 20px;
          font-weight: 500;
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
        }

        .btn-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 500;
        }

        .btn-link:hover {
          text-decoration: underline;
          color: #0b5ed7;
        }

        .alert {
          border-radius: 8px;
        }

        .form-text {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .text-danger {
          color: #dc3545 !important;
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
      `}</style>
    </div>
  );
};

export default StudentAuth;
