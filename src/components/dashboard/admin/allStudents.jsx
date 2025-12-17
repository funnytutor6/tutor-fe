import React, { useEffect, useState, useMemo } from "react";
import { studentService } from "../../../api/services/studentService";
import DataTable from "./dataTable";
import AdminSearchInput from "./adminSearchInput";
import StudentDetailsModal from "./studentDetailsModal";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AllStudents = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger, currentPage, pageSize, searchTerm]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentService.getAllStudents({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      });
      const data = response?.data?.items || [];
      setStudents(data);
      setTotalStudents(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const name = row.original.name || row.original.fullName || "N/A";
          const email = row.original.email || "";
          return (
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
              <div>
                <div>{name}</div>
                {email && (
                  <div
                    className="text-muted small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {email}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        header: "Location",
        accessorKey: "cityOrTown",
        cell: ({ row }) => {
          const city =
            row.original.cityOrTown || row.original.townOrCity || "N/A";
          const country = row.original.country
            ? `, ${row.original.country}`
            : "";
          return (
            <span>
              <i className="bi bi-geo-alt me-2"></i>
              {city}
              {country}
            </span>
          );
        },
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
        cell: ({ row }) => {
          const phone = row.original.phoneNumber || row.original.phone || "N/A";
          return (
            <span>
              <i className="bi bi-telephone me-2"></i>
              {phone}
            </span>
          );
        },
      },
      {
        header: "Created",
        accessorKey: "created",
        cell: ({ getValue }) => {
          const value = getValue();
          const date = value ? new Date(value).toLocaleDateString() : "N/A";
          return (
            <span>
              <i className="bi bi-calendar3 me-2"></i>
              {date}
            </span>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button
            className="btn btn-sm"
            onClick={() => {
              setSelectedStudentId(row.original.id);
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
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          All Students
        </h4>
        <span className="badge bg-primary">{totalStudents} students</span>
      </div>
      <AdminSearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by name, email, phone, city or grade..."
      />

      <DataTable
        data={students}
        columns={columns}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={totalStudents}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
      />

      <StudentDetailsModal
        studentId={selectedStudentId}
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedStudentId(null);
        }}
      />
    </div>
  );
};

export default AllStudents;
