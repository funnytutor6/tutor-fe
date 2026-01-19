import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const subscriptionService = {
  /**
   * Get subscription status
   */
  getSubscriptionStatus: async (teacherEmail) => {
    const response = await api.get(ENDPOINTS.GET_SUBSCRIPTION_STATUS);
    return response.data;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (cancelAtPeriodEnd = false) => {
    const response = await api.post(ENDPOINTS.CANCEL_SUBSCRIPTION, {
      cancelAtPeriodEnd,
    });
    return response.data;
  },

  /**
   * Reactivate subscription
   */
  reactivateSubscription: async (teacherEmail) => {
    const response = await api.post(ENDPOINTS.REACTIVATE_SUBSCRIPTION, {
      teacherEmail,
    });
    return response.data;
  },

  /**
   * Get invoice history
   */
  getInvoiceHistory: async (teacherEmail) => {
    const response = await api.get(ENDPOINTS.GET_INVOICE_HISTORY(teacherEmail));
    return response.data;
  },

  /**
   * Cancel student subscription
   */
  cancelStudentSubscription: async (cancelAtPeriodEnd = false) => {
    const response = await api.post(ENDPOINTS.CANCEL_STUDENT_SUBSCRIPTION, {
      cancelAtPeriodEnd,
    });
    return response.data;
  },

  /**
   * Reactivate student subscription
   */
  reactivateStudentSubscription: async () => {
    const response = await api.post(ENDPOINTS.REACTIVATE_STUDENT_SUBSCRIPTION);
    return response.data;
  },

  /**
   * Get student subscription status
   */
  getStudentSubscriptionStatus: async () => {
    const response = await api.get(ENDPOINTS.GET_STUDENT_SUBSCRIPTION_STATUS);
    return response.data;
  },

  /**
   * Get student invoice history
   */
  getStudentInvoiceHistory: async () => {
    const response = await api.get(ENDPOINTS.GET_STUDENT_INVOICE_HISTORY);
    return response.data;
  },

  /**
   * Create customer portal session for student
   */
  createStudentCustomerPortalSession: async () => {
    const response = await api.post(ENDPOINTS.CREATE_STUDENT_CUSTOMER_PORTAL);
    return response.data;
  },

  /**
   * Create customer portal session for teacher
   */
  createCustomerPortalSession: async () => {
    const response = await api.post(ENDPOINTS.CREATE_CUSTOMER_PORTAL);
    return response.data;
  },
};
