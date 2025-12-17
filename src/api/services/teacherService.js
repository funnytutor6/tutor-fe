import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const teacherService = {
  /**
   * Get teacher by ID
   */
  getTeacherById: async (id) => {
    const response = await api.get(ENDPOINTS.GET_TEACHER(id));
    return response.data;
  },

  /**
   * Update teacher profile
   */
  updateTeacher: async (id, teacherData, profilePhotoFile) => {
    const formData = new FormData();

    Object.keys(teacherData).forEach((key) => {
      if (teacherData[key] !== undefined && teacherData[key] !== null) {
        formData.append(key, teacherData[key]);
      }
    });

    if (profilePhotoFile) {
      formData.append("profilePhoto", profilePhotoFile);
    }

    const response = await api.put(ENDPOINTS.UPDATE_TEACHER(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get all teachers
   */
  getAllTeachers: async () => {
    const response = await api.get(ENDPOINTS.GET_ALL_TEACHERS);
    return response.data;
  },

  /**
   * Get all teachers for admin
   */
  getAllTeachersForAdmin: async ({ page, pageSize, search }) => {
    const response = await api.get(ENDPOINTS.GET_ALL_TEACHERS_ADMIN, {
      params: { page, pageSize, search },
    });
    return response.data;
  },

  /**
   * Get pending teachers for admin
   */
  getPendingTeachersForAdmin: async ({ page, pageSize, search }) => {
    const response = await api.get(ENDPOINTS.GET_PENDING_TEACHERS_ADMIN, {
      params: { page, pageSize, search },
    });
    return response.data;
  },

  /**
   * Delete teacher account
   */
  deleteTeacher: async (id) => {
    const response = await api.delete(ENDPOINTS.DELETE_TEACHER(id));
    return response.data;
  },
};
