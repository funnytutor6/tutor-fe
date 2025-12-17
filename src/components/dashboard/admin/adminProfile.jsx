import React, { useEffect, useState } from "react";
import { adminService } from "../../../api/services/adminService";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminProfile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminProfile();
      const data = response?.data || response;
      setProfile(data);
      setFormData({
        email: data.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error fetching admin profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isEditing) {
      // Email validation
      if (!formData.email || !formData.email.includes("@")) {
        newErrors.email = "Valid email is required";
      }

      // Password validation (only if new password is provided)
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = "Current password is required";
        }
        if (formData.newPassword.length < 6) {
          newErrors.newPassword = "Password must be at least 6 characters";
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const updateData = {};
      if (formData.email !== profile.email) {
        updateData.email = formData.email;
      }
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        toast.error("No changes to save");
        return;
      }

      const response = await adminService.updateAdminProfile(updateData);
      const data = response?.data || response;

      // Update auth context with new email if changed
      if (updateData.email) {
        const updatedUser = {
          ...user,
          email: data.email,
        };
        await login(updatedUser);
      }

      setProfile(data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      email: profile?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  if (loading && !profile) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-person-badge me-2"></i>
          Admin Profile
        </h4>
        {!isEditing && (
          <button
            className="btn"
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: "#667eea",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.5rem",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit Profile
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div
            className="card"
            style={{
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="card-header border-0"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "16px 16px 0 0",
                padding: "1.5rem 2rem",
              }}
            >
              <h5 className="mb-0" style={{ fontWeight: "600" }}>
                <i className="bi bi-person-circle me-2"></i>
                Profile Information
              </h5>
            </div>
            <div className="card-body" style={{ padding: "2rem" }}>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem",
                        border: errors.email
                          ? "2px solid #dc3545"
                          : "1px solid #dee2e6",
                      }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>
                      Change Password (Optional)
                    </label>
                    <input
                      type="password"
                      className={`form-control mb-3 ${
                        errors.currentPassword ? "is-invalid" : ""
                      }`}
                      name="currentPassword"
                      placeholder="Current Password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem",
                        border: errors.currentPassword
                          ? "2px solid #dc3545"
                          : "1px solid #dee2e6",
                      }}
                    />
                    {errors.currentPassword && (
                      <div className="invalid-feedback">
                        {errors.currentPassword}
                      </div>
                    )}
                    <input
                      type="password"
                      className={`form-control mb-3 ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem",
                        border: errors.newPassword
                          ? "2px solid #dc3545"
                          : "1px solid #dee2e6",
                      }}
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    )}
                    <input
                      type="password"
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem",
                        border: errors.confirmPassword
                          ? "2px solid #dc3545"
                          : "1px solid #dee2e6",
                      }}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                    <small className="text-muted">
                      Leave password fields empty if you don't want to change
                      password
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn"
                      disabled={loading}
                      style={{
                        backgroundColor: "#667eea",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.75rem 2rem",
                        fontWeight: 500,
                      }}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem 2rem",
                        fontWeight: 500,
                        border: "2px solid #e9ecef",
                      }}
                    >
                      <i className="bi bi-x-lg me-2"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-4">
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "#667eea15",
                            color: "#667eea",
                          }}
                        >
                          <i className="bi bi-person-fill" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <div>
                          <div
                            className="text-muted small"
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Name
                          </div>
                          <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                            {profile?.name || "Admin User"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "#10b98115",
                            color: "#10b981",
                          }}
                        >
                          <i
                            className="bi bi-envelope-fill"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </div>
                        <div>
                          <div
                            className="text-muted small"
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Email Address
                          </div>
                          <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                            {profile?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "#8b5cf615",
                            color: "#8b5cf6",
                          }}
                        >
                          <i
                            className="bi bi-shield-check-fill"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </div>
                        <div>
                          <div
                            className="text-muted small"
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Role
                          </div>
                          <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                            {profile?.role || "Administrator"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {profile?.lastLogin && (
                    <div className="mb-4">
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              background: "#f59e0b15",
                              color: "#f59e0b",
                            }}
                          >
                            <i
                              className="bi bi-clock-history"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                          <div>
                            <div
                              className="text-muted small"
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Last Login
                            </div>
                            <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                              {profile.lastLogin
                                ? new Date(profile.lastLogin).toLocaleString()
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile?.created && (
                    <div>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              background: "#3b82f615",
                              color: "#3b82f6",
                            }}
                          >
                            <i
                              className="bi bi-calendar-check-fill"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                          <div>
                            <div
                              className="text-muted small"
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Account Created
                            </div>
                            <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
                              {new Date(profile.created).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

