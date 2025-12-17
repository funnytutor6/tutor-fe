import api from "../axiosConfig";
import { ENDPOINTS } from "../endpoints";

export const uploadService = {
  /**
   * Upload image to Cloudinary via backend
   */
  uploadImage: async (file, folder = "teacher-profiles") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const response = await api.post(ENDPOINTS.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data?.data;
  },

  /**
   * Delete image from Cloudinary via backend
   */
  deleteImage: async (publicId) => {
    const response = await api.post(ENDPOINTS.DELETE_IMAGE, { publicId });
    return response.data;
  },
};

// Export for backward compatibility
export const uploadImageToCloudinary = uploadService.uploadImage;
export const deleteImageFromCloudinary = uploadService.deleteImage;
