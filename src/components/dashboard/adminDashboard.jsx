import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../api/services/adminService";
import AdminInfo from "./admin/adminInfo";
import SubscriptionEmails from "./admin/subscriptionEmails";
import TeacherSubscriptions from "./admin/teacherSubscriptions";
import StudentSubscriptions from "./admin/studentSubscriptions";
import AllTeachers from "./admin/allTeachers";
import PendingTeachers from "./admin/pendingTeachers";
import AllStudents from "./admin/allStudents";
import AllStudentPosts from "./admin/allStudentPosts";
import AllTeacherPosts from "./admin/allTeacherPosts";
import AdminProfile from "./admin/adminProfile";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    lastLogin: "",
    role: "Administrator",
  });

  const [subscriptionEmails, setSubscriptionEmails] = useState([]);
  const [teacherSubscriptions, setTeacherSubscriptions] = useState([]);
  const [studentSubscriptions, setStudentSubscriptions] = useState([]);
  const [pendingTeachersCount, setPendingTeachersCount] = useState(0);
  const [totalTeachersCount, setTotalTeachersCount] = useState(0);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [studentPostsCount, setStudentPostsCount] = useState(0);
  const [teacherPostsCount, setTeacherPostsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Set admin details from auth context
      setAdminDetails({
        name: user?.name || "Admin User",
        email: user?.email || "admin@school.com",
        lastLogin: new Date().toLocaleString(),
        role: user?.role === "admin" ? "Super Administrator" : "Administrator",
      });

      // Fetch subscription emails
      const subscriptionsResponse = await api.get(
        ENDPOINTS.SUBSCRIBE_NEWSLETTER
      );

      const formattedSubscriptions =
        subscriptionsResponse?.data?.items?.map((item) => ({
          id: item.id,
          email: item.field,
          subscribedAt: new Date(item.created).toLocaleDateString(),
          plan: "Basic",
        })) || [];
      setSubscriptionEmails(formattedSubscriptions);

      // Fetch teacher premium subscriptions (using new endpoint)
      try {
        const teacherResponse =
          await adminService.getAllTeacherSubscriptionsForAdmin({
            page: 1,
            pageSize: 1000, // Get all for dashboard count
            search: "",
          });
        const teacherData = teacherResponse?.data || teacherResponse;
        const formattedTeachers = (teacherData.items || []).map((item) => ({
          id: item.id,
          name: item.mail.split("@")[0],
          email: item.mail,
          subscriptionType: item.ispaid ? "Premium" : "Free",
          expiryDate: item.currentPeriodEnd
            ? new Date(item.currentPeriodEnd).toLocaleDateString()
            : item.paymentDate
            ? new Date(
                new Date(item.paymentDate).getTime() + 365 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()
            : "N/A",
          isPaid: item.ispaid,
          paymentAmount: item.paymentAmount,
          subscriptionStatus: item.subscriptionStatus,
          currentPeriodEnd: item.currentPeriodEnd,
        }));
        setTeacherSubscriptions(formattedTeachers);
      } catch (error) {
        console.error("Error fetching teacher subscriptions:", error);
        setTeacherSubscriptions([]);
      }

      // Fetch student premium subscriptions
      const studentResponse = await api.get(
        ENDPOINTS.STUDENT_PREMIUM_SUBSCRIPTIONS
      );
      console.log("studentResponse", studentResponse);
      const formattedStudents =
        studentResponse?.data?.items?.map((item) => ({
          id: item.id,
          name: item.email.split("@")[0],
          email: item.email,
          grade: "N/A",
          subject: item.subject || "N/A",
          subscriptionType: item.ispayed ? "Premium" : "Free",
          expiryDate: item.paymentDate
            ? new Date(
                new Date(item.paymentDate).getTime() + 365 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()
            : "N/A",
          isPaid: item.ispayed,
          paymentAmount: item.paymentAmount,
        })) || [];
      setStudentSubscriptions(formattedStudents);

      // Fetch dashboard metrics from new endpoint
      try {
        const metricsResponse = await adminService.getDashboardMetrics();
        const metrics = metricsResponse?.data || metricsResponse;

        setTotalTeachersCount(metrics.totalTeachers || 0);
        setPendingTeachersCount(metrics.pendingTeachers || 0);
        setTotalStudentsCount(metrics.totalStudents || 0);
        setStudentPostsCount(metrics.studentPosts || 0);
        setTeacherPostsCount(metrics.teacherPosts || 0);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        // Set defaults on error
        setTotalTeachersCount(0);
        setPendingTeachersCount(0);
        setTotalStudentsCount(0);
        setStudentPostsCount(0);
        setTeacherPostsCount(0);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setIsLoading(false);
      toast.error("Failed to load dashboard data");
    }
  };

  // Function to refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchData();
    toast.success("Data refreshed");
  };

  const handleStatusUpdate = () => {
    // Refresh pending count when status is updated
    fetchData();
  };

  // Calculate statistics
  const stats = {
    totalUsers:
      subscriptionEmails.length +
      teacherSubscriptions.length +
      studentSubscriptions.length,
    paidSubscriptions:
      teacherSubscriptions.filter((t) => t.isPaid).length +
      studentSubscriptions.filter((s) => s.isPaid).length,
    pendingApprovals: pendingTeachersCount,
    totalTeachers: totalTeachersCount,
  };

  const menuSections = [
    {
      title: "Dashboard",
      items: [
        {
          id: "dashboard",
          label: "Overview",
          icon: "speedometer2",
          badge: null,
        },
      ],
    },
    {
      title: "Teachers",
      items: [
        {
          id: "all-teachers",
          label: "All Teachers",
          icon: "people",
          badge: totalTeachersCount,
        },
        {
          id: "pending",
          label: "Pending Approvals",
          icon: "clock-history",
          badge: pendingTeachersCount,
          badgeClass: "warning",
        },
        {
          id: "teachers",
          label: "Premium Subscriptions",
          icon: "star",
          badge: teacherSubscriptions.filter((t) => t.isPaid).length,
        },
        {
          id: "teacher-posts",
          label: "Teacher Posts",
          icon: "briefcase",
          badge: teacherPostsCount,
        },
      ],
    },
    {
      title: "Students",
      items: [
        {
          id: "all-students",
          label: "All Students",
          icon: "people",
          badge: totalStudentsCount,
        },
        {
          id: "students",
          label: "Premium Subscriptions",
          icon: "mortarboard",
          badge: studentSubscriptions.filter((s) => s.isPaid).length,
        },
        {
          id: "student-posts",
          label: "Student Posts",
          icon: "card-text",
          badge: studentPostsCount,
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          id: "emails",
          label: "Newsletter Subscribers",
          icon: "envelope-check",
          badge: subscriptionEmails.length,
        },
        {
          id: "profile",
          label: "My Profile",
          icon: "person-badge",
          badge: null,
        },
      ],
    },
  ];

  // Render error state
  if (error && !isLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Error loading dashboard
              </h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-primary" onClick={refreshData}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex"
      style={{ minHeight: "calc(100vh - 90px)", marginTop: "14px" }}
    >
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
        style={{
          width: sidebarCollapsed ? "80px" : "280px",
          minHeight: "calc(100vh - 90px)",
          transition: "width 0.3s ease",
          position: "fixed",
          left: 0,
          top: "90px",
          zIndex: 1040,
          background: "#ffffff",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <div className="p-3 border-bottom" style={{ borderColor: "#e0e0e0" }}>
          <div className="d-flex align-items-center justify-content-between mt-3">
            {!sidebarCollapsed && (
              <h5 className="mb-0 text-dark">
                <i className="bi bi-shield-check me-2"></i>
                Admin Panel
              </h5>
            )}
            <button
              className="btn btn-link text-dark p-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i
                className={`bi bi-${
                  sidebarCollapsed ? "chevron-right" : "chevron-left"
                }`}
              ></i>
            </button>
          </div>
        </div>

        <nav
          className={`nav flex p-2 ${
            sidebarCollapsed ? "align-items-center" : ""
          }`}
          style={{ overflowY: "scroll", maxHeight: "calc(84vh - 100px)" }}
        >
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!sidebarCollapsed && (
                <div
                  className="text-uppercase text-muted px-3 py-2"
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  {section.title}
                </div>
              )}
              {sidebarCollapsed && (
                <div
                  className="border-bottom mb-2"
                  style={{ opacity: 0.3 }}
                ></div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`nav-link text-start mb-1 rounded  ${
                    activeSection === item.id ? "text-white" : "text-dark"
                  }`}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    padding: "12px 16px",
                    border: "none",
                    background:
                      activeSection === item.id
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "transparent",
                    transition: "all 0.2s ease",
                    borderRadius: "8px",
                    color: activeSection === item.id ? "white" : "#333",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <div className="d-flex align-items-center ">
                    <i
                      className={`bi bi-${item.icon} ${
                        !sidebarCollapsed ? "me-3" : ""
                      }`}
                    ></i>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-grow-1">{item.label}</span>
                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`badge bg-${
                              item.badgeClass || "primary"
                            } ms-2`}
                            style={{
                              backgroundColor:
                                activeSection === item.id
                                  ? "rgba(255, 255, 255, 0.3)"
                                  : "",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div
          className="position-absolute bottom-0 w-100 p-3 border-top"
          style={{ borderColor: "#e0e0e0", backgroundColor: "#f8f9fa" }}
        >
          <div className="d-flex align-items-center">
            {!sidebarCollapsed && (
              <>
                <div className="flex-grow-1">
                  <div className="small text-muted">{adminDetails.name}</div>
                  <div className="small text-dark">{adminDetails.email}</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={logout}
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            )}
            {sidebarCollapsed && (
              <button
                className="btn btn-sm btn-outline-primary w-100"
                onClick={logout}
                title="Logout"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarCollapsed ? "80px" : "280px",
          width: sidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 280px)",
          transition: "margin-left 0.3s ease, width 0.3s ease",
          minHeight: "calc(100vh - 90px)",
        }}
      >
        {/* Content Area */}
        <div className="p-4">
          {isLoading && activeSection === "dashboard" ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AdminInfo adminDetails={adminDetails} stats={stats} />
                  </div>
                </div>
              )}

              {activeSection === "emails" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <SubscriptionEmails
                      data={subscriptionEmails}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}

              {activeSection === "teachers" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <TeacherSubscriptions
                      data={teacherSubscriptions}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}

              {activeSection === "students" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <StudentSubscriptions isLoading={isLoading} />
                  </div>
                </div>
              )}

              {activeSection === "all-students" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AllStudents refreshTrigger={refreshTrigger} />
                  </div>
                </div>
              )}

              {activeSection === "student-posts" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AllStudentPosts refreshTrigger={refreshTrigger} />
                  </div>
                </div>
              )}

              {activeSection === "teacher-posts" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AllTeacherPosts refreshTrigger={refreshTrigger} />
                  </div>
                </div>
              )}

              {activeSection === "all-teachers" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AllTeachers refreshTrigger={refreshTrigger} />
                  </div>
                </div>
              )}

              {activeSection === "pending" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <PendingTeachers
                      refreshTrigger={refreshTrigger}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                </div>
              )}

              {activeSection === "profile" && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <AdminProfile />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
