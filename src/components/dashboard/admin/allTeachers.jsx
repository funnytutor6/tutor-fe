import React, { useState, useMemo } from "react";
import DataTable from "./dataTable";
import TeacherDetailsModal from "./teacherDetailsModal";
import { adminService } from "../../../api/services/adminService.js";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSearchInput from "./adminSearchInput.jsx";
import { teacherService } from "../../../api/services/teacherService.js";

const AllTeachers = ({
  refreshTrigger,
  onNavigateToTeacherPosts,
}) => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  React.useEffect(() => {
    fetchTeachers();
  }, [refreshTrigger, searchTerm, currentPage, pageSize]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await teacherService.getAllTeachersForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      });
      const data = response?.data?.items || [];
      setTeachers(data);
      setTotalTeachers(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    const term = searchTerm.toLowerCase();
    return teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(term) ||
        teacher.email?.toLowerCase().includes(term) ||
        teacher.phoneNumber?.toLowerCase().includes(term) ||
        teacher.cityOrTown?.toLowerCase().includes(term)
    );
  }, [teachers, searchTerm]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: "warning", text: "Pending" },
      approved: { class: "success", text: "Approved" },
      rejected: { class: "danger", text: "Rejected" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`badge bg-${statusInfo.class}`}>{statusInfo.text}</span>
    );
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
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
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => getStatusBadge(getValue()),
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
          <button
            className="btn btn-sm"
            onClick={() => handleViewDetails(row.original)}
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
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-people me-2"></i>
          All Teachers
        </h4>
        <span className="badge bg-primary">{totalTeachers} teachers</span>
      </div>

      <AdminSearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by name, email, phone, city or country..."
      />

      <DataTable
        data={filteredTeachers}
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
        onNavigateToTeacherPosts={onNavigateToTeacherPosts}
      />
    </div>
  );
};

export default AllTeachers;
