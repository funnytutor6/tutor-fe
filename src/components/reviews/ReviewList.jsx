import React, { useState, useEffect } from "react";
import reviewService from "../../services/reviewService";
import { format } from "date-fns";

const ReviewList = ({ teacherId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [teacherId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getTeacherReviews(teacherId);
      if (data) {
        setReviews(data.reviews || []);
        setStats(data.stats || { averageRating: 0, reviewCount: 0 });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = "1rem") => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bi bi-star${i < rating ? "-fill" : ""}`}
            style={{
              color: i < rating ? "#fbbf24" : "#d1d5db",
              fontSize: size,
            }}
          ></i>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reviews...</span>
        </div>
        <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "0.9rem" }}>
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="review-list-modern">
      {/* Stats Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Average Rating Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            padding: "14px 20px",
            borderRadius: "12px",
            border: "1px solid #fde68a",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.1rem",
              flexShrink: 0,
              boxShadow: "0 3px 8px rgba(245, 158, 11, 0.25)",
            }}
          >
            <i className="bi bi-star-fill"></i>
          </div>
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                color: "#92400e",
                lineHeight: "1.2",
              }}
            >
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#a16207",
                fontWeight: "500",
              }}
            >
              Average Rating
            </div>
          </div>
        </div>

        {/* Review Count Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            padding: "14px 20px",
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.1rem",
              flexShrink: 0,
              boxShadow: "0 3px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            <i className="bi bi-chat-left-text-fill"></i>
          </div>
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                color: "#1e40af",
                lineHeight: "1.2",
              }}
            >
              {stats.reviewCount}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#2563eb",
                fontWeight: "500",
              }}
            >
              {stats.reviewCount === 1 ? "Review" : "Total Reviews"}
            </div>
          </div>
        </div>

        {/* Average Stars */}
        {stats.reviewCount > 0 && (
          <div style={{ marginLeft: "auto" }}>
            {renderStars(Math.round(stats.averageRating), "1.2rem")}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 30px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: "15px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "1.8rem",
              color: "#94a3b8",
            }}
          >
            <i className="bi bi-chat-left-text"></i>
          </div>
          <h6
            style={{
              color: "#475569",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            No reviews yet
          </h6>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "0",
              maxWidth: "320px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Share your review link with students to start collecting feedback!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={review.id}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px 24px",
                transition: "all 0.3s ease",
                cursor: "default",
                borderLeft: "4px solid #fbbf24",
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: review.reviewText ? "12px" : "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  {/* Avatar */}
                  {review.studentPhoto ? (
                    <img
                      src={review.studentPhoto}
                      alt={review.studentName}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e5e7eb",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "1rem",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      {review.studentName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}
                  <div>
                    <h6
                      style={{
                        marginBottom: "2px",
                        color: "#1f2937",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                      }}
                    >
                      {review.studentName || "Anonymous Student"}
                    </h6>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#9ca3af",
                        fontWeight: "400",
                      }}
                    >
                      {format(new Date(review.created), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              {review.reviewText && (
                <p
                  style={{
                    margin: "0",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    borderLeft: "3px solid #e2e8f0",
                    color: "#374151",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    fontStyle: "italic",
                  }}
                >
                  "{review.reviewText}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
