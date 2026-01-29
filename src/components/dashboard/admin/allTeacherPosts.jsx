import React, { useEffect, useState, useMemo } from "react";
import { postService } from "../../../api/services/postService";
import DataTable from "./dataTable";
import AdminSearchInput from "./adminSearchInput";
import TeacherPostDetailsModal from "./teacherPostDetailsModal";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AllTeacherPosts = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger, searchTerm, currentPage, pageSize]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getAllTeacherPostsForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      });
      const data = response?.data?.items || [];
      setPosts(data);
      setTotalPosts(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching teacher posts:", error);
      toast.error("Failed to load Tutor posts");
    } finally {
      setIsLoading(false);
    }
  };


  const columns = useMemo(
    () => [
      {
        header: "Tutor",
        accessorKey: "teacherName",
        cell: ({ row }) => {
          const name = row.original.teacherName || "Unknown";
          return (
            <div className="d-flex align-items-center">
              {row.original.profilePhoto ? (
                <img
                  src={row.original.profilePhoto}
                  alt={name}
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
              <span>{name}</span>
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
        cell: ({ getValue, row }) => {
          const city = getValue() || row.original?.location || row.original?.cityOrTown || "N/A";
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
          <i className="bi bi-briefcase me-2"></i>
          All Tutor Posts
        </h4>
        <span className="badge bg-primary">{totalPosts} posts</span>
      </div>

      <AdminSearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by Tutor, subject, headline, description or city..."
      />

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

      <TeacherPostDetailsModal
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

export default AllTeacherPosts;
