import api from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Review service for interacting with the review API
 */
const reviewService = {
  /**
   * Submit a new review for a teacher
   * @param {Object} reviewData - { teacherId, rating, reviewText }
   */
  submitReview: async (reviewData) => {
    try {
      const response = await api.post(ENDPOINTS.SUBMIT_REVIEW, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get reviews for a specific teacher
   * @param {String} teacherId
   */
  getTeacherReviews: async (teacherId) => {
    try {
      const response = await api.get(ENDPOINTS.GET_TEACHER_REVIEWS(teacherId));
      return response.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get reviews submitted by the current student
   */
  getMyReviews: async () => {
    try {
      const response = await api.get(ENDPOINTS.GET_STUDENT_REVIEWS);
      return response.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reviewService;
