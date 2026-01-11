import React, { useState, useMemo } from "react";
import DataTable from "./dataTable";
import TeacherDetailsModal from "./teacherDetailsModal";
import { adminService } from "../../../api/services/adminService.js";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSearchInput from "./adminSearchInput.jsx";
import { teacherService } from "../../../api/services/teacherService.js";

const PendingTeachers = ({ refreshTrigger, onStatusUpdate }) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionModal, setActionModal] = useState({
    show: false,
    teacher: null,
    action: null,
  });
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  React.useEffect(() => {
    fetchPendingTeachers();
  }, [refreshTrigger, searchTerm, currentPage, pageSize]);

  const fetchPendingTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await teacherService.getPendingTeachersForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      });
      const data = response?.data?.items || [];
      setTeachers(data);
      setTotalTeachers(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching pending teachers:", error);
      toast.error("Failed to load pending teachers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (teacherId, status) => {
    try {
      setProcessing(true);
      await adminService.updateTeacherStatus(teacherId, status);
      toast.success(`Teacher ${status} successfully`);

      // Remove teacher from list if approved or rejected
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));

      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate();
      }

      setActionModal({ show: false, teacher: null, action: null });
    } catch (error) {
      console.error("Error updating teacher status:", error);
      toast.error(`Failed to ${status} teacher`);
    } finally {
      setProcessing(false);
    }
  };

  const handleActionClick = (teacher, action) => {
    setActionModal({ show: true, teacher, action });
  };

  const getActionButton = (action, teacher) => {
    const buttonConfig = {
      approve: {
        backgroundColor: "#10b981",
        hoverColor: "#059669",
        icon: "check-circle",
        text: "Approve",
      },
      reject: {
        backgroundColor: "#ef4444",
        hoverColor: "#dc2626",
        icon: "x-circle",
        text: "Reject",
      },
      pending: {
        backgroundColor: "#f59e0b",
        hoverColor: "#d97706",
        icon: "clock",
        text: "Keep Pending",
      },
    };

    const config = buttonConfig[action];
    return (
      <button
        className="btn btn-sm"
        onClick={() => handleActionClick(teacher, action)}
        disabled={processing}
        style={{
          backgroundColor: processing ? "#e9ecef" : config.backgroundColor,
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          padding: "0.4rem 0.9rem",
          fontWeight: 500,
          transition: "all 0.2s ease",
          fontSize: "0.875rem",
          cursor: processing ? "not-allowed" : "pointer",
          opacity: processing ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!processing) {
            e.currentTarget.style.backgroundColor = config.hoverColor;
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 8px rgba(${
              action === "approve"
                ? "16, 185, 129"
                : action === "reject"
                ? "239, 68, 68"
                : "245, 158, 11"
            }, 0.3)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!processing) {
            e.currentTarget.style.backgroundColor = config.backgroundColor;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </button>
    );
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {row.original.profilePhoto ? (
              <img
                src={row.original.profilePhoto}
                alt={row.original.name}
                className="rounded-circle me-2"
                style={{ width: "32px", height: "32px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="bi bi-person text-white"></i>
              </div>
            )}
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ getValue }) => (
          <span>
            <i className="bi bi-envelope me-2"></i>
            {getValue()}
          </span>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
        cell: ({ getValue }) => getValue() || "N/A",
      },
      {
        header: "Location",
        accessorKey: "cityOrTown",
        cell: ({ row }) => {
          const location = row.original.cityOrTown || "N/A";
          const country = row.original.country
            ? `, ${row.original.country}`
            : "";
          return (
            <span>
              {location}
              {country}
            </span>
          );
        },
      },
      {
        header: "Created Date",
        accessorKey: "created",
        cell: ({ getValue }) => {
          const date = getValue();
          return date ? new Date(date).toLocaleDateString() : "N/A";
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-sm"
              onClick={() => {
                setSelectedTeacher(row.original);
                setShowModal(true);
              }}
              style={{
                backgroundColor: "#667eea",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0.4rem 0.9rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
                fontSize: "0.875rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#5568d3";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#667eea";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <i className="bi bi-eye me-1"></i>
              View
            </button>
            {getActionButton("approve", row.original)}
            {getActionButton("reject", row.original)}
          </div>
        ),
      },
    ],
    [processing]
  );

  const getActionMessage = (action) => {
    const messages = {
      approve: "Are you sure you want to approve this teacher?",
      reject: "Are you sure you want to reject this teacher?",
      pending: "Keep this teacher as pending?",
    };
    return messages[action] || "";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-clock-history me-2"></i>
          Pending Teacher Approvals
        </h4>
        <span className="badge bg-warning">{totalTeachers} pending</span>
      </div>
      <AdminSearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by teacher, subject, headline, description or city..."
      />
      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
      />

      <TeacherDetailsModal
        teacher={selectedTeacher}
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedTeacher(null);
        }}
      />

      {/* Confirmation Modal */}
      {actionModal.show && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() =>
              !processing &&
              setActionModal({ show: false, teacher: null, action: null })
            }
            style={{ zIndex: 1055 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1056 }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget && !processing) {
                setActionModal({ show: false, teacher: null, action: null });
              }
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Action</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setActionModal({
                        show: false,
                        teacher: null,
                        action: null,
                      })
                    }
                    disabled={processing}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{getActionMessage(actionModal.action)}</p>
                  {actionModal.teacher && (
                    <div className="alert alert-info">
                      <strong>Teacher:</strong> {actionModal.teacher.name}
                      <br />
                      <strong>Email:</strong> {actionModal.teacher.email}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setActionModal({
                        show: false,
                        teacher: null,
                        action: null,
                      })
                    }
                    disabled={processing}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1.25rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!processing) {
                        e.currentTarget.style.backgroundColor = "#5a6268";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!processing) {
                        e.currentTarget.style.backgroundColor = "#6c757d";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      handleStatusUpdate(
                        actionModal.teacher.id,
                        actionModal.action === "approve"
                          ? "approved"
                          : actionModal.action === "reject"
                          ? "rejected"
                          : "pending"
                      )
                    }
                    disabled={processing}
                    style={{
                      backgroundColor:
                        actionModal.action === "approve"
                          ? "#10b981"
                          : actionModal.action === "reject"
                          ? "#ef4444"
                          : "#f59e0b",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1.25rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      cursor: processing ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!processing) {
                        const hoverColor =
                          actionModal.action === "approve"
                            ? "#059669"
                            : actionModal.action === "reject"
                            ? "#dc2626"
                            : "#d97706";
                        e.currentTarget.style.backgroundColor = hoverColor;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!processing) {
                        const originalColor =
                          actionModal.action === "approve"
                            ? "#10b981"
                            : actionModal.action === "reject"
                            ? "#ef4444"
                            : "#f59e0b";
                        e.currentTarget.style.backgroundColor = originalColor;
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        {actionModal.action === "approve" && (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Approve
                          </>
                        )}
                        {actionModal.action === "reject" && (
                          <>
                            <i className="bi bi-x-circle me-1"></i>
                            Reject
                          </>
                        )}
                        {actionModal.action === "pending" && (
                          <>
                            <i className="bi bi-clock me-1"></i>
                            Keep Pending
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PendingTeachers;
