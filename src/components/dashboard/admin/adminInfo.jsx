import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminInfo = ({ adminDetails, stats, onNavigate }) => {
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalUsers || 0,
      icon: "bi-people-fill",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
      navigateTo: "all-students",
    },
    {
      title: "Paid Subscriptions",
      value: stats.paidSubscriptions || 0,
      icon: "bi-check-circle-fill",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
      navigateTo: "teachers",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals || 0,
      icon: "bi-clock-history",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
      navigateTo: "pending",
    },
    {
      title: "Total Tutors",
      value: stats.totalTeachers || 0,
      icon: "bi-person-workspace",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      iconBg: "rgba(255, 255, 255, 0.2)",
      navigateTo: "all-teachers",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h4 className="mb-0" style={{ fontWeight: 600, color: "#1e293b" }}>
          <i
            className="bi bi-speedometer2 me-2"
            style={{ color: "#667eea" }}
          ></i>
          Dashboard Overview
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Admin Information Card */}
      <div className="mb-4">
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e9ecef",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "1.5rem",
              color: "#ffffff",
            }}
          >
            <h5 className="mb-0" style={{ fontWeight: 600 }}>
              <i className="bi bi-person-badge me-2"></i>
              Admin Information
            </h5>
          </div>
          <div className="p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                    }}
                  >
                    <i
                      className="bi bi-person text-white"
                      style={{ fontSize: "1.25rem" }}
                    ></i>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#6b7280",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Name
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {adminDetails.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                    }}
                  >
                    <i
                      className="bi bi-envelope text-white"
                      style={{ fontSize: "1.25rem" }}
                    ></i>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#6b7280",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Email
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {adminDetails.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                    }}
                  >
                    <i
                      className="bi bi-shield-check text-white"
                      style={{ fontSize: "1.25rem" }}
                    ></i>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#6b7280",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Role
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {adminDetails.role}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                    }}
                  >
                    <i
                      className="bi bi-clock-history text-white"
                      style={{ fontSize: "1.25rem" }}
                    ></i>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#6b7280",
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Last Login
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {adminDetails.lastLogin}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3">
        {statCards.map((card, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div
              style={{
                background: card.gradient,
                borderRadius: "16px",
                padding: "1.5rem",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
              }}
              onClick={() => onNavigate && onNavigate(card.navigateTo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    backgroundColor: card.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className={`bi ${card.icon}`}
                    style={{ fontSize: "1.75rem" }}
                  ></i>
                </div>
                <i
                  className="bi bi-arrow-right-circle"
                  style={{
                    fontSize: "1.25rem",
                    opacity: 0.7,
                  }}
                ></i>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: 0.9,
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {card.value.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInfo;
