import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TeacherDetailsModal = ({ teacher, show, onHide }) => {
  if (!teacher) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        class: "warning",
        text: "Pending Approval",
        icon: "clock-history",
        gradient: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
      },
      approved: {
        class: "success",
        text: "Approved",
        icon: "check-circle-fill",
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      },
      rejected: {
        class: "danger",
        text: "Rejected",
        icon: "x-circle-fill",
        gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <div
        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
        style={{
          background: statusInfo.gradient,
          color: "white",
          fontSize: "0.875rem",
          fontWeight: "600",
        }}
      >
        <i className={`bi bi-${statusInfo.icon} me-2`}></i>
        {statusInfo.text}
      </div>
    );
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
                    Teacher Profile
                  </h5>
                  <small style={{ opacity: 0.9 }}>
                    Complete teacher information and status
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
              {/* Profile Header */}
              <div
                className="text-center mb-3 p-3 rounded-3 d-flex align-items-center gap-3 "
                style={{
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                  border: "2px solid #e9ecef",
                }}
              >
                <div className="position-relative d-inline-block">
                  {teacher.profilePhoto ? (
                    <img
                      src={teacher.profilePhoto}
                      alt={teacher.name}
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
                <div className="text-start">
                  <h4
                    className="mt-3 mb-2"
                    style={{ fontWeight: "700", color: "#333" }}
                  >
                    {teacher.name}
                  </h4>

                  <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                    <i className="bi bi-hash me-1"></i>
                    <code
                      style={{
                        background: "#f8f9fa",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {teacher.id}
                    </code>
                  </div>
                </div>
                <div className="text-center">
                  {getStatusBadge(teacher.status)}
                </div>
              </div>

              {/* Information Grid */}
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
                    value={teacher.email}
                    color="#667eea"
                  />
                  <InfoCard
                    icon="telephone-fill"
                    label="Phone Number"
                    value={teacher.phoneNumber}
                    color="#10b981"
                  />
                  <InfoCard
                    icon="geo-alt-fill"
                    label="Location"
                    value={
                      teacher.cityOrTown || teacher.country
                        ? `${teacher.cityOrTown || ""}${
                            teacher.cityOrTown && teacher.country ? ", " : ""
                          }${teacher.country || ""}`
                        : null
                    }
                    color="#f59e0b"
                  />
                </div>

                {/* System Information */}
                <div className="col-md-6 mb-2">
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
                    Account Information
                  </h6>
                  <InfoCard
                    icon="calendar-check"
                    label="Registration Date"
                    value={
                      teacher.created
                        ? new Date(teacher.created).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : null
                    }
                    color="#8b5cf6"
                  />
                  <InfoCard
                    icon="clock-history"
                    label="Last Updated"
                    value={
                      teacher.updated
                        ? new Date(teacher.updated).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : null
                    }
                    color="#ec4899"
                  />
                  <InfoCard
                    icon={
                      teacher.status === "approved"
                        ? "shield-check"
                        : "shield-exclamation"
                    }
                    label="Account Status"
                    value={
                      <span
                        className="text-capitalize"
                        style={{ fontWeight: "600" }}
                      >
                        {teacher.status || "Pending"}
                      </span>
                    }
                    color={
                      teacher.status === "approved"
                        ? "#10b981"
                        : teacher.status === "rejected"
                        ? "#ef4444"
                        : "#f59e0b"
                    }
                  />
                </div>
              </div>
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

export default TeacherDetailsModal;
