import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../api/services/authService.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Email Verification Component
 * Used after registration for both Student and Teacher
 *
 * @param {Object} props
 * @param {String} props.userId - User ID (studentId or teacherId)
 * @param {String} props.userType - 'student' or 'teacher'
 * @param {String} props.email - Email address to verify
 * @param {String} props.userName - User's name for display
 * @param {Function} props.onVerificationSuccess - Callback when email is verified
 * @param {Function} props.onBackToLogin - Callback to go back to login
 */
const EmailVerification = ({
  userId,
  userType,
  email,
  userName,
  onVerificationSuccess,
  onBackToLogin,
}) => {
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [error, setError] = useState("");

  // Format email for display (mask middle characters)
  const formatEmailForDisplay = (emailAddr) => {
    if (!emailAddr) return "";
    const [localPart, domain] = emailAddr.split("@");
    if (localPart.length <= 3) return emailAddr;
    const start = localPart.substring(0, 2);
    const end = localPart.substring(localPart.length - 1);
    return `${start}***${end}@${domain}`;
  };

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleOTPChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpCode(digits);
      setError("");
      // Focus last input
      const lastInput = document.getElementById("email-otp-5");
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  const handleVerifyEmail = async () => {
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.verifyEmail(userId, userType, email, otpString);
      toast.success("Email verified successfully! You can now log in.");

      // Call success callback if provided
      if (onVerificationSuccess) {
        await onVerificationSuccess();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Invalid verification code";
      setError(errorMessage);
      toast.error(errorMessage);
      // Clear OTP on error
      setOtpCode(["", "", "", "", "", ""]);
      // Focus first input
      const firstInput = document.getElementById("email-otp-0");
      if (firstInput) {
        firstInput.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError("");

    try {
      await authService.resendEmailVerification(userId, userType, email);
      toast.success("Verification code sent successfully!");
      setOtpCode(["", "", "", "", "", ""]);
      setCooldownSeconds(60);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to resend code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i
                    className="bi bi-envelope-check"
                    style={{ fontSize: "3rem", color: "#667eea" }}
                  ></i>
                </div>
                <h2 className="fw-bold">Verify Your Email</h2>
                <p className="text-muted">
                  We've sent a 6-digit verification code to your email
                </p>
                {userName && (
                  <p className="mb-1">
                    <strong>Hello, {userName}!</strong>
                  </p>
                )}
                <div className="mt-2">
                  <strong>Email:</strong>{" "}
                  <span className="text-primary">
                    {formatEmailForDisplay(email)}
                  </span>
                </div>
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

              {/* OTP Input Fields */}
              <div className="mb-4">
                <label className="form-label text-center d-block">
                  Enter Verification Code
                </label>
                <div className="d-flex justify-content-center gap-2">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`email-otp-${index}`}
                      type="text"
                      className="form-control text-center"
                      style={{
                        width: "50px",
                        height: "60px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                className="btn btn-primary w-100 py-2 mb-3"
                onClick={handleVerifyEmail}
                disabled={loading || otpCode.join("").length !== 6}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Verify Email
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center mb-3">
                <p className="text-muted mb-2">Didn't receive the code?</p>
                {cooldownSeconds > 0 ? (
                  <div>
                    <p className="text-muted mb-1">
                      Resend available in <strong>{cooldownSeconds}</strong>{" "}
                      second{cooldownSeconds !== 1 ? "s" : ""}
                    </p>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      disabled={true}
                      style={{ cursor: "not-allowed", opacity: 0.5 }}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Resend Code
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleResendCode}
                    disabled={resending}
                  >
                    {resending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Resend Code
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Back to Login */}
              {onBackToLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={onBackToLogin}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </button>
                </div>
              )}

              <div
                className="alert alert-info mt-3"
                role="alert"
                style={{ color: "black" }}
              >
                <i className="bi bi-info-circle-fill me-2"></i>
                <small>
                  The verification code will expire in 10 minutes. Please check
                  your email inbox and spam/junk folder.
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

        .form-control {
          border-radius: 8px;
          border: 2px solid #dee2e6;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .btn-primary {
          border-radius: 8px;
          padding: 12px 20px;
          font-weight: 500;
        }

        .btn-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        .btn-link:hover {
          text-decoration: underline;
          color: #5a6fd6;
        }

        .alert {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;
