import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const purchaseService = {
  /**
   * Get teacher purchases
   */
  getTeacherPurchases: async (teacherId) => {
    const response = await api.get(ENDPOINTS.GET_TEACHER_PURCHASES(teacherId));
    return response.data;
  },

  /**
   * Create checkout session for teacher purchase
   */
  createTeacherPurchaseCheckout: async (purchaseData) => {
    const response = await api.post(ENDPOINTS.CREATE_TEACHER_PURCHASE_CHECKOUT, purchaseData);
    return response.data;
  },

  /**
   * Check if teacher has purchased access
   */
  checkPurchaseStatus: async (teacherId, studentPostId) => {
    const response = await api.get(ENDPOINTS.CHECK_PURCHASE_STATUS(teacherId, studentPostId));
    return response.data;
  },

  /**
   * Get teacher purchase details
   */
  getTeacherPurchaseDetails: async (studentPostId, teacherId) => {
    const response = await api.get(ENDPOINTS.GET_TEACHER_PURCHASE_DETAILS(studentPostId, teacherId));
    return response.data;
  },

  /**
   * Get student contact information
   */
  getStudentContact: async (postId, teacherId) => {
    const response = await api.get(ENDPOINTS.GET_STUDENT_CONTACT(postId, teacherId));
    return response.data;
  },

  /**
   * Create checkout session for contact purchase
   */
  createContactPurchaseCheckout: async (checkoutData) => {
    const response = await api.post(ENDPOINTS.CREATE_CONTACT_PURCHASE_CHECKOUT, checkoutData);
    return response.data;
  },
};

