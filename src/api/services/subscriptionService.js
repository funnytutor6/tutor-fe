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
  cancelSubscription: async (teacherEmail, cancelAtPeriodEnd = false) => {
    const response = await api.post(ENDPOINTS.CANCEL_SUBSCRIPTION, {
      teacherEmail,
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
};
