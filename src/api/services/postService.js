import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const postService = {
  /**
   * Get all student posts
   */
  getAllStudentPosts: async () => {
    const response = await api.get(ENDPOINTS.GET_ALL_STUDENT_PUBLIC_POSTS);
    return response.data;
  },

  /**
   * Create a new student post
   */
  createStudentPost: async (postData) => {
    const response = await api.post(ENDPOINTS.CREATE_STUDENT_POST, postData);
    return response.data;
  },

  /**
   * Update a student post
   */
  updateStudentPost: async (id, postData) => {
    const response = await api.put(ENDPOINTS.UPDATE_STUDENT_POST(id), postData);
    return response.data;
  },

  /**
   * Delete a student post
   */
  deleteStudentPost: async (id) => {
    const response = await api.delete(ENDPOINTS.DELETE_STUDENT_POST(id));
    return response.data;
  },

  /**
   * Get all teacher posts
   */
  getAllTeacherPosts: async () => {
    const response = await api.get(ENDPOINTS.GET_ALL_TEACHER_POSTS);
    return response.data;
  },

  /**
   * Admin: Get all teacher posts
   */
  getAllTeacherPostsForAdmin: async ({ page, pageSize, search }) => {
    const response = await api.get(ENDPOINTS.GET_ALL_TEACHER_POSTS_FOR_ADMIN, {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return response.data;
  },

  /**
   * Get teacher posts by teacher ID
   */
  getTeacherPostsByTeacherId: async (teacherId) => {
    const response = await api.get(ENDPOINTS.GET_TEACHER_POSTS(teacherId));
    return response.data;
  },

  /**
   * Get teacher posts by teacher ID (simple version)
   */
  getTeacherPostsByTeacherIdSimple: async (teacherId) => {
    const response = await api.get(
      ENDPOINTS.GET_TEACHER_POSTS_SIMPLE(teacherId)
    );
    return response.data;
  },

  /**
   * Create a new teacher post
   */
  createTeacherPost: async (postData) => {
    const response = await api.post(ENDPOINTS.CREATE_TEACHER_POST, postData);
    return response.data;
  },

  /**
   * Update a teacher post
   */
  updateTeacherPost: async (id, postData) => {
    const response = await api.put(ENDPOINTS.UPDATE_TEACHER_POST(id), postData);
    return response.data;
  },

  /**
   * Delete a teacher post
   */
  deleteTeacherPost: async (id) => {
    const response = await api.delete(ENDPOINTS.DELETE_TEACHER_POST(id));
    return response.data;
  },

  /**
   * Get all student posts for admin
   */
  getAllStudentPostsForAdmin: async ({ page, pageSize, search }) => {
    const response = await api.get(ENDPOINTS.GET_ALL_STUDENT_POSTS_FOR_ADMIN, {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return response.data;
  },

  /**
   * Get teacher post with full teacher details (admin)
   */
  getTeacherPostWithDetails: async (postId) => {
    const response = await api.get(
      ENDPOINTS.GET_TEACHER_POST_WITH_DETAILS(postId)
    );
    return response.data;
  },

  /**
   * Get student post with full student details (admin)
   */
  getStudentPostWithDetails: async (postId) => {
    const response = await api.get(
      ENDPOINTS.GET_STUDENT_POST_WITH_DETAILS(postId)
    );
    return response.data;
  },
};
