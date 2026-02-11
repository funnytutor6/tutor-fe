/**
 * API endpoint constants
 */
export const ENDPOINTS = {
  GET_PUBLIC_TEACHER: `/api/teachers/public`,
  // Authentication
  TEACHER_REGISTER: "/api/teachers/register",
  TEACHER_COMPLETE_REGISTRATION: "/api/teachers/complete-registration",
  TEACHER_LOGIN: "/api/teachers/login",
  STUDENT_REGISTER: "/api/students/register",
  STUDENT_COMPLETE_REGISTRATION: "/api/students/complete-registration",
  STUDENT_LOGIN: "/api/students/login",
  ADMIN_LOGIN: "/api/admin/login",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",

  // OTP Verification
  OTP_SEND: "/api/otp/send",
  OTP_VERIFY: "/api/otp/verify",
  OTP_STATUS: "/api/otp/status",
  OTP_CHECK_VERIFIED: "/api/otp/check-verified",

  // Teachers
  GET_TEACHER: (id) => `/api/teachers/${id}`,
  UPDATE_TEACHER: (id) => `/api/teachers/${id}`,
  DELETE_TEACHER: (id) => `/api/teachers/${id}`,
  GET_ALL_TEACHERS: "/api/teachers",
  GET_TEACHER_METRICS: "/api/teachers/metrics",

  // Students
  GET_STUDENT: (id) => `/api/students/${id}`,
  UPDATE_STUDENT: "/api/students",
  GET_ALL_STUDENTS: "/api/students",

  // Posts
  GET_ALL_STUDENT_PUBLIC_POSTS: "/api/posts/public",
  CREATE_STUDENT_POST: "/api/posts",
  UPDATE_STUDENT_POST: (id) => `/api/posts/${id}`,
  DELETE_STUDENT_POST: (id) => `/api/posts/${id}`,
  GET_ALL_TEACHER_POSTS: "/api/posts/teachers/public",
  GET_TEACHER_POSTS: "/api/posts/teachers/posts",
  GET_TEACHER_POSTS_SIMPLE: (teacherId) =>
    `/api/post/teachers/${teacherId}/posts-simple`,
  CREATE_TEACHER_POST: "/api/posts/teachers/posts",
  UPDATE_TEACHER_POST: (id) => `/api/posts/teachers/posts/${id}`,
  DELETE_TEACHER_POST: (id) => `/api/posts/teachers/posts/${id}`,

  // Connection Requests
  SEND_CONNECTION_REQUEST: "/api/connect/requests/send",
  GET_CONNECTION_REQUESTS: "/api/connect/requests/teacher",
  GET_CONNECTION_REQUESTS_FOR_STUDENT: "/api/connect/requests/student",
  GET_CONNECTION_REQUEST_COUNT: "/api/connect/requests/teacher/count",
  GET_CONNECTION_REQUEST: (requestId) => `/api/connect/requests/${requestId}`,
  PURCHASE_CONNECTION_REQUEST: (requestId) =>
    `/api/connect/requests/${requestId}/purchase`,
  GET_REQUEST_STATUS: (postId, studentId) =>
    `/api/posts/${postId}/request-status/${studentId}`,

  // Purchases
  GET_TEACHER_PURCHASES: (teacherId) =>
    `/api/buy/teacher-purchases/teacher/${teacherId}`,
  CREATE_TEACHER_PURCHASE_CHECKOUT:
    "/api/buy/teacher-purchases/create-checkout-session",
  CHECK_PURCHASE_STATUS: (teacherId, studentPostId) =>
    `/api/buy/teacher-purchases/check/${teacherId}/${studentPostId}`,
  GET_TEACHER_PURCHASE_DETAILS: (studentPostId, teacherId) =>
    `/api/buy/teacher-purchases/${studentPostId}/${teacherId}`,
  GET_STUDENT_CONTACT: (postId, teacherId) =>
    `/api/buy/posts/${postId}/contact/${teacherId}`,
  CREATE_CONTACT_PURCHASE_CHECKOUT: "/api/create-checkout-session",

  // Premium
  CHECK_TEACHER_PREMIUM: `/check-premium-status`,
  CREATE_TEACHER_PREMIUM_CHECKOUT: "/create-premium-checkout-session",
  UPDATE_TEACHER_PREMIUM_CONTENT: "/update-premium-content",
  CHECK_STUDENT_PREMIUM: `/check-student-premium-status`,
  CREATE_STUDENT_PREMIUM_CHECKOUT: "/create-student-premium-checkout-session",

  // Upload
  UPLOAD_IMAGE: "/api/upload-image",
  DELETE_IMAGE: "/api/delete-image",

  // Webhook
  CHECK_PAYMENT: (sessionId) => `/api/check-payment/${sessionId}`,
  SUBSCRIBE_NEWSLETTER: "/api/collections/findtutor_subcriptions/records/",
  TEACHER_PREMIUM_SUBSCRIPTIONS:
    "/api/collections/findtutor_premium_teachers/records/",
  STUDENT_PREMIUM_SUBSCRIPTIONS:
    "/api/collections/findtitor_premium_student/records/",

  // Admin
  GET_ALL_TEACHERS_ADMIN: "/api/admin/teachers",
  GET_PENDING_TEACHERS_ADMIN: "/api/admin/teachers/pending",
  UPDATE_TEACHER_STATUS: (id) => `/api/admin/teachers/${id}/status`,
  GET_ALL_TEACHER_POSTS_FOR_ADMIN: "/api/admin/teacher-posts",
  GET_TEACHER_POST_WITH_DETAILS: (id) => `/api/admin/teacher-posts/${id}`,
  GET_ALL_STUDENTS_ADMIN: "/api/admin/students",
  GET_STUDENT_WITH_DETAILS: (id) => `/api/admin/students/${id}`,
  GET_ALL_STUDENT_POSTS_FOR_ADMIN: "/api/admin/student-posts",
  GET_STUDENT_POST_WITH_DETAILS: (id) => `/api/admin/student-posts/${id}`,
  GET_ADMIN_DASHBOARD_METRICS: "/api/admin/dashboard/metrics",
  GET_ADMIN_PROFILE: "/api/admin/profile",
  UPDATE_ADMIN_PROFILE: "/api/admin/profile",
  GET_ALL_PREMIUM_STUDENTS_FOR_ADMIN: "/api/admin/students/premium",
  GET_ADMIN_REPORTS: "/api/admin/reports",
  GET_ALL_TEACHER_SUBSCRIPTIONS_FOR_ADMIN: "/api/admin/teacher-subscriptions",

  // Subscriptions
  GET_SUBSCRIPTION_STATUS: `/api/subscriptions/status`,
  CANCEL_SUBSCRIPTION: "/api/subscriptions/cancel",
  REACTIVATE_SUBSCRIPTION: "/api/subscriptions/reactivate",
  GET_INVOICE_HISTORY: (email) => `/api/subscriptions/invoice-history/${email}`,
  CREATE_STUDENT_PREMIUM_CHECKOUT: "/create-student-premium-checkout-session",
  CHECK_STUDENT_PREMIUM_STATUS: `/check-student-premium-status`,
  // Student Subscriptions
  GET_STUDENT_SUBSCRIPTION_STATUS: "/api/subscriptions/student/status",
  CANCEL_STUDENT_SUBSCRIPTION: "/api/subscriptions/student/cancel",
  REACTIVATE_STUDENT_SUBSCRIPTION: "/api/subscriptions/student/reactivate",
  CREATE_STUDENT_CUSTOMER_PORTAL: "/api/subscriptions/student/customer-portal",
  CREATE_CUSTOMER_PORTAL: "/api/subscriptions/customer-portal",
  GET_STUDENT_INVOICE_HISTORY: (email) =>
    `/api/subscriptions/student/invoice-history?email=${email}`,

  // Reviews
  SUBMIT_REVIEW: "/api/reviews",
  GET_TEACHER_REVIEWS: (teacherId) => `/api/reviews/teacher/${teacherId}`,
  GET_STUDENT_REVIEWS: "/api/reviews/student",
};
