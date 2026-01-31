import React, { useEffect, useState, useMemo } from "react";
import { postService } from "../../../api/services/postService";
import { studentService } from "../../../api/services/studentService";
import DataTable from "./dataTable";
import AdminSearchInput from "./adminSearchInput";
import StudentPostDetailsModal from "./studentPostDetailsModal";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AllStudentPosts = ({
  refreshTrigger,
  initialFilterStudentId,
}) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialFilterStudentId || ""
  );
  const [studentsForFilter, setStudentsForFilter] = useState([]);

  useEffect(() => {
    if (
      initialFilterStudentId !== undefined &&
      initialFilterStudentId !== null
    ) {
      setSelectedStudentId(initialFilterStudentId || "");
    }
  }, [initialFilterStudentId]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await studentService.getAllStudents({
          page: 1,
          pageSize: 100,
          search: "",
        });
        const items = response?.data?.items || response?.items || [];
        setStudentsForFilter(items);
      } catch (err) {
        console.error("Error loading students for filter:", err);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger, currentPage, pageSize, searchTerm, selectedStudentId]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const effectiveStudentId =
        initialFilterStudentId ?? selectedStudentId ?? "";
      const response = await postService.getAllStudentPostsForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
        studentId: effectiveStudentId || undefined,
      });
      const data = response?.data?.items || [];
      setPosts(data);
      setTotalPosts(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching student posts:", error);
      toast.error("Failed to load student posts");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Student",
        accessorKey: "studentName",
        cell: ({ row }) => {
          const name = row.original.studentName || "Unknown";
          const grade = row.original.grade || "";
          return (
            <div>
              <div>{name}</div>
              {grade && (
                <div
                  className="text-muted small"
                  style={{ fontSize: "0.75rem" }}
                >
                  Grade: {grade}
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Subject",
        accessorKey: "subject",
        cell: ({ getValue }) => {
          const subject = getValue() || "N/A";
          return (
            <span
              className="badge bg-light text-dark border"
              style={{ fontSize: "0.75rem" }}
            >
              {subject}
            </span>
          );
        },
      },
      {
        header: "Headline",
        accessorKey: "headline",
        cell: ({ getValue }) => {
          const headline = getValue() || "N/A";
          return <span>{headline}</span>;
        },
      },
      {
        header: "Location",
        accessorKey: "townOrCity",
        cell: ({ getValue }) => {
          const city = getValue() || "N/A";
          return (
            <span>
              <i className="bi bi-geo-alt me-2"></i>
              {city}
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
              setSelectedPostId(row.original.id);
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
          <i className="bi bi-card-text me-2"></i>
          All Student Posts
        </h4>
        <span className="badge bg-primary">{totalPosts} posts</span>
      </div>

      <div className="d-flex align-items-start gap-3 mb-3 flex-wrap">
        <div className="" style={{ minWidth: "500px" }}>
          <AdminSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by student, subject, headline, description or city..."
          />
        </div>
        <div className="">
          <select
            className="form-select"
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: "200px" , height: "47px" ,
              borderRadius: "10px"} }
          >
            <option value="">All Students</option>
            {studentsForFilter.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.fullName || s.email || s.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={posts}
        columns={columns}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={totalPosts}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
      />

      <StudentPostDetailsModal
        postId={selectedPostId}
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPostId(null);
        }}
      />
    </div>
  );
};

export default AllStudentPosts;
