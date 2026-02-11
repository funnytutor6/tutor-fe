import React, { useState } from "react";
import { toast } from "react-hot-toast";
import reviewService from "../../services/reviewService";

const ReviewForm = ({ teacherId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.submitReview({
        teacherId,
        rating,
        reviewText,
      });

      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form card shadow-sm p-4 mt-4">
      <h4 className="mb-4">Write a Review</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label d-block">Rating</label>
          <div className="star-rating h3 text-warning">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={`btn btn-link p-0 text-decoration-none ${
                    index <= (hover || rating) ? "text-warning" : "text-muted"
                  }`}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <i
                    className={`bi bi-star${index <= (hover || rating) ? "-fill" : ""} me-1`}
                  ></i>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="reviewText" className="form-label">
            Your Review (Optional)
          </label>
          <textarea
            id="reviewText"
            className="form-control"
            rows="4"
            placeholder="Share your experience with this tutor..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
