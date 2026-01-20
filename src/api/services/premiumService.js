import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const premiumService = {
  /**
   * Check teacher premium status
   */
  checkTeacherPremiumStatus: async () => {
    const response = await api.get(ENDPOINTS.CHECK_TEACHER_PREMIUM);
    return response.data;
  },

  /**
   * Create teacher premium checkout session
   */
  createTeacherPremiumCheckout: async (checkoutData) => {
    const response = await api.post(
      ENDPOINTS.CREATE_TEACHER_PREMIUM_CHECKOUT,
      checkoutData
    );
    return response.data;
  },

  /**
   * Update teacher premium content
   */
  updateTeacherPremiumContent: async (contentData) => {
    const response = await api.post(
      ENDPOINTS.UPDATE_TEACHER_PREMIUM_CONTENT,
      contentData
    );
    return response.data;
  },

  /**
   * Check student premium status
   */
  checkStudentPremiumStatus: async () => {
    const response = await api.get(ENDPOINTS.CHECK_STUDENT_PREMIUM);
    return response.data;
  },

  /**
   * Create student premium checkout session
   */
  createStudentPremiumCheckout: async (checkoutData) => {
    const response = await api.post(
      ENDPOINTS.CREATE_STUDENT_PREMIUM_CHECKOUT,
      checkoutData
    );
    return response.data;
  },
};
