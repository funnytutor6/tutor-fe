import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload image to Cloudinary via backend
 * @param {File} file - The image file to upload
 * @param {String} folder - Optional folder name (default: 'teacher-profiles')
 * @returns {Promise<Object>} - Upload result with URL
 */
export const uploadImageToCloudinary = async (
  file,
  folder = "teacher-profiles"
) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    console.log("📤 Uploading image to Cloudinary...", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      folder: folder,
    });

    const response = await axios.post(
      `${API_BASE_URL}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Image uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw new Error(error.response?.data?.error || "Failed to upload image");
  }
};

/**
 * Upload image to Cloudinary using direct upload (if you want to use Cloudinary preset)
 * This is an alternative method that uploads directly to Cloudinary
 * @param {File} file - The image file to upload
 * @param {String} cloudName - Your Cloudinary cloud name
 * @param {String} uploadPreset - Your Cloudinary upload preset
 * @returns {Promise<Object>} - Upload result with URL
 */
export const uploadImageDirectly = async (file, cloudName, uploadPreset) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    console.log("📤 Uploading image directly to Cloudinary...");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    console.log("✅ Image uploaded successfully:", response.data);
    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      format: response.data.format,
      width: response.data.width,
      height: response.data.height,
    };
  } catch (error) {
    console.error("❌ Error uploading image directly:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * Delete image from Cloudinary via backend
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    console.log("🗑️ Deleting image from Cloudinary...", publicId);

    const response = await axios.post(`${API_BASE_URL}/delete-image`, {
      publicId,
    });

    console.log("✅ Image deleted successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    throw new Error(error.response?.data?.error || "Failed to delete image");
  }
};

/**
 * Validate image file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File must be an image (JPEG, PNG, GIF, or WebP)",
    };
  }

  return { valid: true, error: null };
};

export default {
  uploadImageToCloudinary,
  uploadImageDirectly,
  deleteImageFromCloudinary,
  validateImageFile,
};
