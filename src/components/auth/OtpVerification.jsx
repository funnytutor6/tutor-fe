import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { otpService } from "../../api/services/otpService.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Reusable OTP Verification Component
 * Can be used for both Student and Teacher registration
 *
 * @param {Object} props
 * @param {String} props.userId - User ID (studentId or teacherId)
 * @param {String} props.userType - 'student' or 'teacher'
 * @param {String} props.phoneNumber - Phone number with country code
 * @param {Function} props.onVerificationSuccess - Callback when OTP is verified
 * @param {Function} props.onChangePhone - Callback to change phone number
 * @param {String} props.redirectPath - Path to redirect after successful verification
 */
const OtpVerification = ({
  userId,
  userType,
  phoneNumber: initialPhoneNumber,
  onVerificationSuccess,
  onChangePhone,
  redirectPath,
}) => {
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [otpStatus, setOtpStatus] = useState(null);
  const [error, setError] = useState("");

  // Format phone number for display (mask middle digits)
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    if (phone.length <= 8) return phone;
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 3);
    return `${start}***${end}`;
  };

  // Check OTP status on mount and when phone number changes
  // useEffect(() => {
  //   if (userId && userType && phoneNumber) {
  //     checkOTPStatus();
  //     // Also send OTP if this is first load and no active OTP
  //     const sendInitialOTP = async () => {
  //       try {
  //         const status = await otpService.getOTPStatus(
  //           userId,
  //           userType,
  //           phoneNumber
  //         );
  //         // If no active OTP, send one automatically
  //         if (!status.hasActiveOTP) {
  //           await handleSendOTP();
  //         }
  //       } catch (error) {
  //         console.error("Error checking initial OTP status:", error);
  //       }
  //     };
  //     sendInitialOTP();
  //   }
  // }, [userId, userType, phoneNumber]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const checkOTPStatus = async () => {
    try {
      const status = await otpService.getOTPStatus(
        userId,
        userType,
        phoneNumber
      );
      setOtpStatus(status);

      // Set cooldown if there's a recent OTP
      if (
        status.hasActiveOTP &&
        !status.canResend &&
        status.cooldownSeconds > 0
      ) {
        setCooldownSeconds(status.cooldownSeconds);
      } else if (status.canResend) {
        setCooldownSeconds(0);
      }

      return status;
    } catch (error) {
      console.error("Error checking OTP status:", error);
      return null;
    }
  };

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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
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
      const lastInput = document.getElementById("otp-5");
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    // ssd

    setSendingOTP(true);
    setError("");

    try {
      const result = await otpService.sendOTP(userId, userType, phoneNumber);
      toast.success("OTP sent successfully!");
      setOtpCode(["", "", "", "", "", ""]);

      // Set cooldown from response
      if (result.cooldownSeconds) {
        setCooldownSeconds(result.cooldownSeconds);
      }

      // Also refresh status
      await checkOTPStatus();
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

  const handleVerifyOTP = async () => {
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await otpService.verifyOTP(userId, userType, phoneNumber, otpString);
      toast.success("Phone number verified successfully!");

      // Call success callback if provided
      if (onVerificationSuccess) {
        await onVerificationSuccess();
      }

      // Redirect if path provided
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Invalid OTP code";
      setError(errorMessage);
      toast.error(errorMessage);
      // Clear OTP on error
      setOtpCode(["", "", "", "", "", ""]);
      // Focus first input
      const firstInput = document.getElementById("otp-0");
      if (firstInput) {
        firstInput.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    if (onChangePhone) {
      onChangePhone();
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
                    className="bi bi-shield-check"
                    style={{ fontSize: "3rem", color: "#0d6efd" }}
                  ></i>
                </div>
                <h2 className="fw-bold">Verify Your Phone Number</h2>
                <p className="text-muted">
                  We've sent a 6-digit verification code to your WhatsApp
                </p>
                <div className="mt-3">
                  <strong>Phone Number:</strong>{" "}
                  <span className="text-primary">
                    {formatPhoneForDisplay(phoneNumber)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
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
                      id={`otp-${index}`}
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
                onClick={handleVerifyOTP}
                disabled={loading || otpCode.join("").length !== 6}
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
                    Verify OTP
                  </>
                )}
              </button>

              {/* Resend OTP */}
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
                      Resend OTP
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleSendOTP}
                    disabled={sendingOTP}
                  >
                    {sendingOTP ? (
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
                        Resend OTP
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Change Phone Number */}
              {onChangePhone && (
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleChangePhone}
                    disabled={loading}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Change Phone Number
                  </button>
                </div>
              )}

              <div className="alert alert-info mt-3" role="alert">
                <i className="bi bi-info-circle-fill me-2"></i>
                <small>
                  The verification code will expire in 10 minutes. Make sure to
                  check your WhatsApp messages.
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
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          border-color: #86b7fe;
        }

        .btn-primary {
          border-radius: 8px;
          padding: 12px 20px;
          font-weight: 500;
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
      `}</style>
    </div>
  );
};

export default OtpVerification;
