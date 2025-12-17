import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const authService = {
  /**
   * Admin login
   */
  adminLogin: async (email, password) => {
    const response = await api.post(ENDPOINTS.ADMIN_LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Teacher login
   */
  loginTeacher: async (email, password) => {
    const response = await api.post(ENDPOINTS.TEACHER_LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Student login
   */
  loginStudent: async (email, password) => {
    const response = await api.post(ENDPOINTS.STUDENT_LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Teacher register
   */
  registerTeacher: async (teacherData) => {
    const response = await api.post(ENDPOINTS.TEACHER_REGISTER, teacherData);
    return response.data;
  },

  /**
   * Student register
   */
  registerStudent: async (studentData) => {
    const response = await api.post(ENDPOINTS.STUDENT_REGISTER, studentData);
    return response.data;
  },

  /**
   * Complete student registration after OTP verification
   */
  completeStudentRegistration: async (studentId) => {
    const response = await api.post(ENDPOINTS.STUDENT_COMPLETE_REGISTRATION, {
      studentId,
    });
    return response.data;
  },

  /**
   * Complete teacher registration after OTP verification
   */
  completeTeacherRegistration: async (teacherId) => {
    const response = await api.post(ENDPOINTS.TEACHER_COMPLETE_REGISTRATION, {
      teacherId,
    });
    return response.data;
  },

  /**
   * Forgot password - Send OTP to email
   */
  forgotPassword: async (email, userType) => {
    const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, {
      email,
      userType,
    });
    return response.data;
  },

  /**
   * Reset password - Verify OTP and update password
   */
  resetPassword: async (email, userType, otpCode, newPassword) => {
    const response = await api.post(ENDPOINTS.RESET_PASSWORD, {
      email,
      userType,
      otpCode,
      newPassword,
    });
    return response.data;
  },
};
