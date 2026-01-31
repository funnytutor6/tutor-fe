import React, { useEffect, useState } from "react";
import { studentService } from "../../../api/services/studentService";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StudentDetailsModal = ({
  studentId,
  show,
  onHide,
  onNavigateToStudentPosts,
}) => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && studentId) {
      fetchStudentDetails();
    } else {
      // Reset state when modal closes
      setStudentData(null);
      setError(null);
    }
  }, [show, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudentWithDetails(studentId);
      const data = response?.data || response;
      setStudentData(data);
    } catch (err) {
      console.error("Error fetching student details:", err);
      setError("Failed to load student details");
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ icon, label, value, color = "#667eea" }) => (
    <div
      className="p-3 rounded-3 mb-3"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        border: "1px solid #e9ecef",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="d-flex align-items-start">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: "40px",
            height: "40px",
            background: `${color}15`,
            color: color,
            flexShrink: 0,
          }}
        >
          <i className={`bi bi-${icon}`} style={{ fontSize: "1.2rem" }}></i>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="text-muted mb-1"
            style={{
              fontSize: "0.75rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </div>
          <div
            className="fw-semibold"
            style={{
              fontSize: "0.95rem",
              color: "#333",
              wordBreak: "break-word",
            }}
          >
            {value || (
              <span className="text-muted fst-italic">Not provided</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const getPremiumBadge = (premium) => {
    if (!premium?.hasPremium) {
      return (
        <div
          className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
          style={{
            background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-x-circle-fill me-2"></i>
          Free Plan
        </div>
      );
    }

    if (premium.isPaid) {
      return (
        <div
          className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          Premium (Paid)
        </div>
      );
    }

    return (
      <div
        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          color: "white",
          fontSize: "0.875rem",
          fontWeight: "600",
        }}
      >
        <i className="bi bi-clock-history me-2"></i>
        Premium (Unpaid)
      </div>
    );
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onHide}
        style={{ zIndex: 1055 }}
      ></div>
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1056 }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onHide();
          }
        }}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content"
            style={{ border: "none", borderRadius: "16px" }}
          >
            {/* Header */}
            <div
              className="modal-header border-0"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "16px 16px 0 0",
                padding: "1.5rem 2rem",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <i
                    className="bi bi-person-badge"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </div>
                <div>
                  <h5
                    className="modal-title mb-0"
                    style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  >
                    Student Profile
                  </h5>
                  <small style={{ opacity: 0.9 }}>
                    Complete student information and statistics
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body" style={{ padding: "1.5rem 1.75rem" }}>
              {loading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading student details...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              ) : studentData ? (
                <>
                  {/* Student Profile Header */}
                  <div
                    className="text-center mb-4 p-3 rounded-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <div className="position-relative d-inline-block">
                        {studentData.student?.profilePhoto ? (
                          <img
                            src={studentData.student.profilePhoto}
                            alt={studentData.student.name}
                            className="rounded-circle"
                            style={{
                              width: "96px",
                              height: "96px",
                              objectFit: "cover",
                              border: "4px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                              width: "96px",
                              height: "96px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "4px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          >
                            <i
                              className="bi bi-person-fill text-white"
                              style={{ fontSize: "3rem" }}
                            ></i>
                          </div>
                        )}
                      </div>
                      <div className="text-start flex-grow-1">
                        <h4
                          className="mb-2"
                          style={{ fontWeight: "700", color: "#333" }}
                        >
                          {studentData.student?.name || "Unknown Student"}
                        </h4>
                        <div
                          className="text-muted mb-2"
                          style={{ fontSize: "0.875rem" }}
                        >
                          <i className="bi bi-envelope me-1"></i>
                          {studentData.student?.email || "N/A"}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {getPremiumBadge(studentData.premium)}
                          {typeof onNavigateToStudentPosts === "function" ? (
                            <button
                              type="button"
                              className="d-inline-flex align-items-center px-3 py-2 rounded-pill border-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                fontSize: "0.875rem",
                                fontWeight: "600",
                              }}
                              onClick={() =>
                                onNavigateToStudentPosts(
                                  studentData.student?.id ?? studentId
                                )
                              }
                            >
                              <i className="bi bi-file-post me-2"></i>
                              {studentData.postCount || 0} Posts
                            </button>
                          ) : (
                            <div
                              className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                              style={{
                                background:
                                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                fontSize: "0.875rem",
                                fontWeight: "600",
                              }}
                            >
                              <i className="bi bi-file-post me-2"></i>
                              {studentData.postCount || 0} Posts
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Contact Information */}
                    <div className="col-md-6 mb-3">
                      <h6
                        className="mb-3"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#667eea",
                        }}
                      >
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Contact Information
                      </h6>
                      <InfoCard
                        icon="envelope-fill"
                        label="Email Address"
                        value={studentData.student?.email}
                        color="#667eea"
                      />
                      <InfoCard
                        icon="telephone-fill"
                        label="Phone Number"
                        value={studentData.student?.phoneNumber}
                        color="#10b981"
                      />
                      <InfoCard
                        icon="geo-alt-fill"
                        label="Location"
                        value={
                          studentData.student?.cityOrTown ||
                          studentData.student?.country
                            ? `${studentData.student.cityOrTown || ""}${
                                studentData.student.cityOrTown &&
                                studentData.student.country
                                  ? ", "
                                  : ""
                              }${studentData.student.country || ""}`
                            : null
                        }
                        color="#f59e0b"
                      />
                    </div>

                    {/* Account & Statistics */}
                    <div className="col-md-6 mb-3">
                      <h6
                        className="mb-3"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#667eea",
                        }}
                      >
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Account & Statistics
                      </h6>
                      <InfoCard
                        icon="calendar-check"
                        label="Registration Date"
                        value={
                          studentData.student?.created
                            ? new Date(
                                studentData.student.created
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : null
                        }
                        color="#8b5cf6"
                      />
                      <InfoCard
                        icon="clock-history"
                        label="Last Updated"
                        value={
                          studentData.student?.updated
                            ? new Date(
                                studentData.student.updated
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : null
                        }
                        color="#ec4899"
                      />
                      {typeof onNavigateToStudentPosts === "function" ? (
                        <div
                          className="p-3 rounded-3 mb-3"
                          style={{
                            background:
                              "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                            border: "1px solid #e9ecef",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            onNavigateToStudentPosts(
                              studentData.student?.id ?? studentId
                            )
                          }
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#3b82f615",
                                color: "#3b82f6",
                                flexShrink: 0,
                              }}
                            >
                              <i
                                className="bi bi-file-post"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                className="text-muted mb-1"
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Total Posts
                              </div>
                              <div
                                className="fw-semibold text-primary"
                                style={{
                                  fontSize: "0.95rem",
                                  wordBreak: "break-word",
                                }}
                              >
                                {studentData.postCount || 0} — Click to view
                                posts
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <InfoCard
                          icon="file-post"
                          label="Total Posts"
                          value={studentData.postCount || 0}
                          color="#3b82f6"
                        />
                      )}
                      {studentData.premium?.premiumData && (
                        <>
                          {studentData.premium.premiumData.paymentDate && (
                            <InfoCard
                              icon="credit-card-fill"
                              label="Premium Payment Date"
                              value={new Date(
                                studentData.premium.premiumData.paymentDate
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                              color="#10b981"
                            />
                          )}
                          {studentData.premium.premiumData.paymentAmount && (
                            <InfoCard
                              icon="currency-dollar"
                              label="Premium Amount"
                              value={`$${studentData.premium.premiumData.paymentAmount}`}
                              color="#f59e0b"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer */}
            <div
              className="modal-footer border-0"
              style={{
                padding: "1.5rem 2rem",
                background: "#f8f9fa",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={onHide}
                style={{
                  borderRadius: "8px",
                  fontWeight: "600",
                  border: "2px solid #e9ecef",
                }}
              >
                <i className="bi bi-x-lg me-2"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailsModal;
