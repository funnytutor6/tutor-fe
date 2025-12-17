import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const otpService = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (userId, userType, phoneNumber) => {
    const response = await api.post(ENDPOINTS.OTP_SEND, {
      userId,
      userType,
      phoneNumber,
    });
    return response.data;
  },

  /**
   * Verify OTP code
   */
  verifyOTP: async (userId, userType, phoneNumber, otpCode) => {
    const response = await api.post(ENDPOINTS.OTP_VERIFY, {
      userId,
      userType,
      phoneNumber,
      otpCode,
    });
    return response.data;
  },

  /**
   * Get OTP status (cooldown, expiry, etc.)
   */
  getOTPStatus: async (userId, userType, phoneNumber) => {
    const response = await api.get(ENDPOINTS.OTP_STATUS, {
      params: {
        userId,
        userType,
        phoneNumber,
      },
    });
    return response.data;
  },

  /**
   * Check if phone number is verified
   */
  checkPhoneVerified: async (userId, userType, phoneNumber) => {
    const response = await api.get(ENDPOINTS.OTP_CHECK_VERIFIED, {
      params: {
        userId,
        userType,
        phoneNumber,
      },
    });
    return response.data;
  },
};

