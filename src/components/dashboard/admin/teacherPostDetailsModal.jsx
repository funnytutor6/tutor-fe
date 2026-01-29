import React, { useEffect, useState } from "react";
import { postService } from "../../../api/services/postService";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TeacherPostDetailsModal = ({ postId, show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && postId) {
      fetchPostDetails();
    } else {
      // Reset state when modal closes
      setPostData(null);
      setError(null);
    }
  }, [show, postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getTeacherPostWithDetails(postId);
      const data = response?.data || response;
      setPostData(data);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError("Failed to load post details");
      toast.error("Failed to load post details");
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
                    className="bi bi-briefcase"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </div>
                <div>
                  <h5
                    className="modal-title mb-0"
                    style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  >
                    Tutor Post Details
                  </h5>
                  <small style={{ opacity: 0.9 }}>
                    Complete post and Tutor information
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
                  <p className="mt-3 text-muted">Loading post details...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              ) : postData ? (
                <>
                  {/* Tutor Profile Header */}
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
                        {postData.teacher?.profilePhoto ? (
                          <img
                            src={postData.teacher.profilePhoto}
                            alt={postData.teacher.name}
                            className="rounded-circle"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              border: "4px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                              width: "80px",
                              height: "80px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "4px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          >
                            <i
                              className="bi bi-person-fill text-white"
                              style={{ fontSize: "2.5rem" }}
                            ></i>
                          </div>
                        )}
                      </div>
                      <div className="text-start">
                        <h5
                          className="mb-1"
                          style={{ fontWeight: "700", color: "#333" }}
                        >
                          {postData.teacher?.name || "Unknown Tutor"}
                        </h5>
                        <div className="text-muted small">
                          <i className="bi bi-envelope me-1"></i>
                          {postData.teacher?.email || "N/A"}
                        </div>
                      </div>
                      <div className="text-muted small">
                        {getStatusBadge(postData.teacher?.status)}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Post Information */}
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
                        <i className="bi bi-file-text-fill me-2"></i>
                        Post Information
                      </h6>
                      <InfoCard
                        icon="card-heading"
                        label="Headline"
                        value={postData.post?.headline}
                        color="#667eea"
                      />
                      <InfoCard
                        icon="book-fill"
                        label="Subject"
                        value={postData.post?.subject}
                        color="#10b981"
                      />
                      <InfoCard
                        icon="mortarboard-fill"
                        label="Lesson Type"
                        value={
                          postData.post?.lessonType
                            ? postData.post.lessonType
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                            : null
                        }
                        color="#8b5cf6"
                      />
                      <InfoCard
                        icon="currency-dollar"
                        label="Price"
                        value={
                          postData.post?.price
                            ? `${postData.post.price} ${postData.post.priceType || "per hour"
                            }`
                            : null
                        }
                        color="#f59e0b"
                      />
                      <div
                        className="p-3 rounded-3 mb-3"
                        style={{
                          background:
                            "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                          border: "1px solid #e9ecef",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
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
                              className="bi bi-file-text-fill"
                              style={{ fontSize: "1.2rem" }}
                            ></i>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              className="text-muted mb-2"
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              Description
                            </div>
                            <div
                              className="fw-semibold"
                              style={{
                                fontSize: "0.95rem",
                                color: "#333",
                                lineHeight: "1.6",
                                maxHeight: "200px",
                                overflowY: "auto",
                                paddingRight: "8px",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {postData.post?.description || (
                                <span className="text-muted fst-italic">
                                  Not provided
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location & Contact */}
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
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        Location & Contact
                      </h6>
                      <InfoCard
                        icon="geo-alt-fill"
                        label="Location"
                        value={
                          postData.post?.location ||
                          postData.post?.townOrDistrict
                        }
                        color="#f59e0b"
                      />
                      <InfoCard
                        icon="signpost-split-fill"
                        label="Distance"
                        value={
                          postData.post?.distanceFromLocation
                            ? `${postData.post.distanceFromLocation} km`
                            : null
                        }
                        color="#ec4899"
                      />
                      <InfoCard
                        icon="telephone-fill"
                        label="Tutor Phone"
                        value={postData.teacher?.phoneNumber}
                        color="#10b981"
                      />
                      <InfoCard
                        icon="geo-alt-fill"
                        label="Tutor Location"
                        value={
                          postData.teacher?.cityOrTown ||
                            postData.teacher?.country
                            ? `${postData.teacher.cityOrTown || ""}${postData.teacher.cityOrTown &&
                              postData.teacher.country
                              ? ", "
                              : ""
                            }${postData.teacher.country || ""}`
                            : null
                        }
                        color="#3b82f6"
                      />
                      <InfoCard
                        icon="calendar-check"
                        label="Post Created"
                        value={
                          postData.post?.created
                            ? new Date(
                              postData.post.created
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

export default TeacherPostDetailsModal;
