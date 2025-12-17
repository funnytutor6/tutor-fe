import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const studentService = {
  /**
   * Get student by ID
   */
  getStudentById: async (id) => {
    const response = await api.get(ENDPOINTS.GET_STUDENT(id));
    return response.data;
  },

  /**
   * Update student profile
   */
  updateStudent: async (id, studentData, profilePhotoFile) => {
    const formData = new FormData();

    Object.keys(studentData).forEach((key) => {
      if (studentData[key] !== undefined && studentData[key] !== null) {
        formData.append(key, studentData[key]);
      }
    });

    if (profilePhotoFile) {
      formData.append("profilePhoto", profilePhotoFile);
    }

    const response = await api.put(ENDPOINTS.UPDATE_STUDENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get all students
   */
  getAllStudents: async ({ page, pageSize, search }) => {
    const response = await api.get(ENDPOINTS.GET_ALL_STUDENTS_ADMIN, {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return response.data;
  },

  /**
   * Get student with premium status and post count (admin)
   */
  getStudentWithDetails: async (studentId) => {
    const response = await api.get(
      ENDPOINTS.GET_STUDENT_WITH_DETAILS(studentId)
    );
    return response.data;
  },

  /**
   * Get all premium students for admin
   */
  getAllPremiumStudentsForAdmin: async ({ page, pageSize, search }) => {
    const response = await api.get(
      ENDPOINTS.GET_ALL_PREMIUM_STUDENTS_FOR_ADMIN,
      {
        params: { page, pageSize, search },
      }
    );
    return response.data;
  },
};
