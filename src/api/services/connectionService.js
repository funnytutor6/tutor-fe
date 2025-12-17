import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const connectionService = {
  /**
   * Send connection request
   */
  sendConnectionRequest: async (requestData) => {
    const response = await api.post(ENDPOINTS.SEND_CONNECTION_REQUEST, requestData);
    return response.data;
  },

  /**
   * Get connection requests for teacher
   */
  getConnectionRequestsForTeacher: async (teacherId) => {
    const response = await api.get(ENDPOINTS.GET_CONNECTION_REQUESTS(teacherId));
    return response.data;
  },

  /**
   * Get connection request count for teacher
   */
  getConnectionRequestCount: async (teacherId) => {
    const response = await api.get(ENDPOINTS.GET_CONNECTION_REQUEST_COUNT(teacherId));
    return response.data;
  },

  /**
   * Get specific connection request
   */
  getConnectionRequestById: async (requestId) => {
    const response = await api.get(ENDPOINTS.GET_CONNECTION_REQUEST(requestId));
    return response.data;
  },

  /**
   * Purchase connection request
   */
  purchaseConnectionRequest: async (requestId, teacherId) => {
    const response = await api.post(ENDPOINTS.PURCHASE_CONNECTION_REQUEST(requestId), { teacherId });
    return response.data;
  },

  /**
   * Get request status for student
   */
  getRequestStatus: async (postId, studentId) => {
    const response = await api.get(ENDPOINTS.GET_REQUEST_STATUS(postId, studentId));
    return response.data;
  },
};

