import React, { useState, useEffect } from "react";
import { connectionService } from "../api/services/connectionService";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StudentConnectionRequests = ({ studentId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (studentId) {
      fetchConnectionRequests();
    }
  }, [studentId]);

  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await connectionService.getConnectionRequestsForStudent();
      const data = response?.data || response;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      setError("Failed to load connection requests");
      toast.error("Failed to load connection requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: "bg-warning text-dark",
        icon: "bi-clock-history",
      },
      purchased: {
        label: "Accepted",
        className: "bg-success",
        icon: "bi-check-circle",
      },
    };

    const config = statusConfig[status] || {
      label: status || "Unknown",
      className: "bg-secondary",
      icon: "bi-question-circle",
    };

    return (
      <span className={`badge ${config.className}`}>
        <i className={`bi ${config.icon} me-1`}></i>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div className="spinner-border text-primary"></div>
        <p style={{ marginTop: "1rem" }}>Loading connection requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={fetchConnectionRequests}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Retry
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 0",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <i
          className="bi bi-inbox"
          style={{
            fontSize: "4rem",
            color: "#6c757d",
            marginBottom: "1rem",
          }}
        ></i>
        <h4 style={{ color: "#6c757d" }}>No connection requests yet</h4>
        <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
          You haven't sent any connection requests to teachers yet. Browse
          teachers and send connection requests to get started!
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {requests.map((request) => (
        <div
          key={request.id}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e9ecef",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                {request.teacherProfilePhoto ? (
                  <img
                    src={request.teacherProfilePhoto}
                    alt={request.teacherName}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#0d6efd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
                <div>
                  <h6 style={{ margin: 0, fontWeight: "600" }}>
                    {request.teacherName}
                  </h6>
                  <small style={{ color: "#6c757d" }}>
                    {getRelativeTime(request.requestDate)}
                  </small>
                </div>
              </div>
            </div>
            <div>{getStatusBadge(request.status)}</div>
          </div>

          {/* Post Details */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#e3f2fd",
                  color: "#1565c0",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
              >
                <i className="bi bi-book me-1"></i>
                {request.postSubject}
              </span>
              {request.postLessonType && (
                <span
                  style={{
                    background:
                      request.postLessonType === "online"
                        ? "#dbeafe"
                        : request.postLessonType === "in-person"
                        ? "#dcfce7"
                        : "#fef3c7",
                    color:
                      request.postLessonType === "online"
                        ? "#1d4ed8"
                        : request.postLessonType === "in-person"
                        ? "#16a34a"
                        : "#92400e",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  <i
                    className={`bi ${
                      request.postLessonType === "online"
                        ? "bi-laptop"
                        : request.postLessonType === "in-person"
                        ? "bi-geo-alt"
                        : "bi-hybrid"
                    } me-1`}
                  ></i>
                  {request.postLessonType === "online"
                    ? "Online"
                    : request.postLessonType === "in-person"
                    ? "In-Person"
                    : "Both"}
                </span>
              )}
            </div>
            <h6
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "0.5rem",
              }}
            >
              {request.postHeadline}
            </h6>
            {request.postDescription && (
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.875rem",
                  marginBottom: 0,
                  lineHeight: "1.5",
                }}
              >
                {request.postDescription.length > 150
                  ? `${request.postDescription.substring(0, 150)}...`
                  : request.postDescription}
              </p>
            )}
            {request.postLocation && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginTop: "0.5rem",
                }}
              >
                <i
                  className="bi bi-geo-alt"
                  style={{ color: "#2563eb" }}
                ></i>
                {request.postLocation}
              </div>
            )}
          </div>

          {/* Request Message */}
          {request.message && (
            <div
              style={{
                backgroundColor: "#fff8e1",
                borderLeft: "4px solid #ffc107",
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#856404",
                  fontStyle: "italic",
                }}
              >
                <strong>Your message:</strong> {request.message}
              </p>
            </div>
          )}

          {/* Request Details */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "1rem",
              borderTop: "1px solid #e9ecef",
              fontSize: "0.875rem",
              color: "#6c757d",
            }}
          >
            <div>
              <i className="bi bi-calendar3 me-1"></i>
              Sent: {formatDate(request.requestDate)}
            </div>
            {request.purchaseDate && (
              <div>
                <i className="bi bi-check-circle me-1"></i>
                Accepted: {formatDate(request.purchaseDate)}
              </div>
            )}
          </div>

          {/* Contact Info (if purchased) */}
          {request.status === "purchased" && request.teacherEmail && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#d1fae5",
                borderRadius: "8px",
                border: "1px solid #10b981",
              }}
            >
              <h6
                style={{
                  margin: 0,
                  marginBottom: "0.5rem",
                  color: "#059669",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                <i className="bi bi-envelope-check me-2"></i>
                Contact Information Available
              </h6>
              <div style={{ fontSize: "0.875rem", color: "#047857" }}>
                <div>
                  <strong>Email:</strong> {request.teacherEmail}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentConnectionRequests;

