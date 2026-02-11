import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/services/authService";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const PasswordResetOTP = ({ email: initialEmail, userType, onBack }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(initialEmail || "");
  const [step, setStep] = useState(initialEmail ? "otp" : "email"); // 'email' or 'otp'
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-send OTP when component mounts with email
    if (step === "otp" && email) {
      handleResendOTP();
    }
  }, [step]);

  useEffect(() => {
    let interval = null;
    if (cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownSeconds]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user types
    if (error) {
      setError("");
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otpCode];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtpCode(newOtp);

    // Focus the last filled input or the last input
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSendingOTP(true);
    setError("");

    try {
      await authService.forgotPassword(email, userType);
      setOtpSent(true);
      setStep("otp");
      setCooldownSeconds(60); // 60 seconds cooldown
      toast.success("OTP sent to your email");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);

      // Try to extract cooldown from error message
      const cooldownMatch = errorMessage.match(/wait (\d+) seconds/);
      if (cooldownMatch) {
        const seconds = parseInt(cooldownMatch[1], 10);
        setCooldownSeconds(seconds);
      }
    } finally {
      setSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldownSeconds > 0) {
      return;
    }

    setSendingOTP(true);
    setError("");

    try {
      await authService.forgotPassword(email, userType);
      setOtpSent(true);
      setCooldownSeconds(60); // 60 seconds cooldown
      toast.success("OTP sent to your email");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);

      // Try to extract cooldown from error message
      const cooldownMatch = errorMessage.match(/wait (\d+) seconds/);
      if (cooldownMatch) {
        const seconds = parseInt(cooldownMatch[1], 10);
        setCooldownSeconds(seconds);
      }
    } finally {
      setSendingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate OTP
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email, userType, otpString, newPassword);
      toast.success("Password reset successfully!");

      // Navigate to login
      const loginPath =
        userType === "student" ? "/login/student" : "/login/teacher";
      window.location.href = loginPath;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to reset password";
      setError(errorMessage);
      toast.error(errorMessage);
      // Clear OTP on error
      setOtpCode(["", "", "", "", "", ""]);
      // Focus first input
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-shield-lock display-4 text-primary mb-3"></i>
                <h2 className="fw-bold">Reset Password</h2>
                {step === "email" ? (
                  <p className="text-muted">
                    Enter your email address to receive a password reset code
                  </p>
                ) : (
                  <p className="text-muted">
                    Enter the OTP sent to <strong>{email}</strong>
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ color: "black" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {otpSent && step === "otp" && (
                <div
                  className="alert alert-success"
                  role="alert"
                  style={{ color: "black" }}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  OTP sent successfully! Check your email.
                </div>
              )}

              {step === "email" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOTP();
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={sendingOTP}
                  >
                    {sendingOTP ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope me-2"></i>
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Enter OTP Code <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex justify-content-between gap-2">
                      {otpCode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          className="form-control text-center"
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            height: "60px",
                            border: error
                              ? "2px solid #dc3545"
                              : "2px solid #dee2e6",
                          }}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          maxLength={1}
                          required
                        />
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">
                        Didn't receive the code?
                      </small>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleResendOTP}
                        disabled={sendingOTP || cooldownSeconds > 0}
                        style={{
                          fontSize: "0.875rem",
                          textDecoration: "none",
                        }}
                      >
                        {sendingOTP ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                            ></span>
                            Sending...
                          </>
                        ) : cooldownSeconds > 0 ? (
                          `Resend in ${cooldownSeconds}s`
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center mt-4">
                <button
                  className="btn btn-link p-0"
                  onClick={onBack}
                  style={{ textDecoration: "none" }}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetOTP;
