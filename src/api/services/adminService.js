import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const adminService = {
  /**
   * Get admin dashboard metrics
   */
  getDashboardMetrics: async () => {
    const response = await api.get(ENDPOINTS.GET_ADMIN_DASHBOARD_METRICS);
    return response.data;
  },

  /**
   * Get all teacher subscriptions for admin
   */
  getAllTeacherSubscriptionsForAdmin: async ({ page, pageSize, search }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const response = await api.get(
      `${ENDPOINTS.GET_ALL_TEACHER_SUBSCRIPTIONS_FOR_ADMIN
      }?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get admin profile
   */
  getAdminProfile: async () => {
    const response = await api.get(ENDPOINTS.GET_ADMIN_PROFILE);
    return response.data;
  },

  /**
   * Update admin profile (email and/or password)
   */
  updateAdminProfile: async (profileData) => {
    const response = await api.put(ENDPOINTS.UPDATE_ADMIN_PROFILE, profileData);
    return response.data;
  },

  /**
   * Update teacher status
   */
  updateTeacherStatus: async (teacherId, status) => {
    const response = await api.put(ENDPOINTS.UPDATE_TEACHER_STATUS(teacherId), {
      status,
    });
    return response.data;
  },

  /**
   * Get reports data
   */
  getReportsData: async () => {
    const response = await api.get(ENDPOINTS.GET_ADMIN_REPORTS);
    return response.data;
  },
};
