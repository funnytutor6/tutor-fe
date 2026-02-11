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

  const renderStars = (rating) => {
    return (
      <div className="text-warning">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bi bi-star${i < rating ? "-fill" : ""} me-1`}
          ></i>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list mt-5">
      <div className="d-flex align-items-center mb-4">
        <h3 className="mb-0 me-3">Reviews</h3>
        <div className="badge bg-primary rounded-pill">
          {stats.reviewCount} {stats.reviewCount === 1 ? "Review" : "Reviews"}
        </div>
        {stats.reviewCount > 0 && (
          <div className="ms-auto d-flex align-items-center">
            <span className="h4 mb-0 me-2">
              {stats.averageRating.toFixed(1)}
            </span>
            {renderStars(Math.round(stats.averageRating))}
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <i className="bi bi-chat-left-text display-4 text-muted mb-3 d-block"></i>
          <p className="text-muted mb-0">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      <div className="avatar me-3">
                        {review.studentPhoto ? (
                          <img
                            src={review.studentPhoto}
                            alt={review.studentName}
                            className="rounded-circle"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {review.studentName?.charAt(0) || "S"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{review.studentName}</h6>
                        <small className="text-muted">
                          {format(new Date(review.created), "MMM dd, yyyy")}
                        </small>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.reviewText && (
                    <p className="card-text text-secondary mb-0 mt-3 fst-italic">
                      "{review.reviewText}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
