import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const TutorReviewPage = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchTeacherDetails();
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/teachers/public/${teacherId}`);
      setTeacher(response.data?.teacher);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container py-5 mt-5 text-center">
        <h3>Tutor not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="profile-image-wrapper me-4">
                  {teacher.profilePhoto ? (
                    <img
                      src={teacher.profilePhoto}
                      alt={teacher.name}
                      className="rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <i className="bi bi-person-fill display-4"></i>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="mb-1">{teacher.name}</h2>
                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {teacher.cityOrTown}, {teacher.country}
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="badge bg-warning text-dark me-2">
                      <i className="bi bi-star-fill me-1"></i>
                      {teacher.averageRating?.toFixed(1) || "0.0"}
                    </div>
                    <span className="text-muted small">
                      ({teacher.reviewCount}{" "}
                      {teacher.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>

              {teacher.about && (
                <div className="about-section bg-light p-3 rounded mb-4">
                  <h6 className="fw-bold mb-2">About the Tutor</h6>
                  <p className="mb-0 text-secondary">
                    {teacher.about.substring(0, 200)}...
                  </p>
                </div>
              )}

              {user?.role === "student" ? (
                <ReviewForm
                  teacherId={teacherId}
                  onReviewSubmitted={() =>
                    setRefreshReviews((prev) => prev + 1)
                  }
                />
              ) : (
                <div className="alert alert-info border-0 shadow-sm">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Please{" "}
                  <a href="/login/student" className="alert-link">
                    login as a student
                  </a>{" "}
                  to write a review.
                </div>
              )}
            </div>
          </div>

          <ReviewList teacherId={teacherId} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default TutorReviewPage;
