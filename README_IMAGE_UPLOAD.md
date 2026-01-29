# Image Upload Feature - Frontend Guide

This guide explains how the image upload functionality works in the Funny Tutor frontend application.

## Overview

The application uses Cloudinary for image storage and CDN delivery. Images are uploaded immediately when selected, providing instant feedback to users.

## Features

✅ **Instant Upload**: Images upload to Cloudinary as soon as they're selected  
✅ **Image Preview**: Users see a preview of their selected image  
✅ **Validation**: Automatic validation of file size and type  
✅ **Progress Indicator**: Visual feedback during upload  
✅ **Error Handling**: Clear error messages for failed uploads  
✅ **Optimized Delivery**: Images served from Cloudinary CDN

## Usage in Components

### Teacher Registration (TeacherAuth.jsx) and Student Registration (StudentAuth.jsx)

Both components use the same pattern for image upload:

```javascript
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "../../services/cloudinaryService";

// In your component
const [uploadingImage, setUploadingImage] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
const [formData, setFormData] = useState({
  // ... other fields
  profilePhotoUrl: null, // Store Cloudinary URL
});

// Handle image selection and upload
const handleImageChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Validate the image file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    alert(validation.error);
    e.target.value = "";
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);

  // Upload to Cloudinary
  setUploadingImage(true);
  try {
    // Use "teacher-profiles" or "student-profiles" folder
    const folder = isTeacher ? "teacher-profiles" : "student-profiles";
    const result = await uploadImageToCloudinary(file, folder);

    setFormData((prev) => ({
      ...prev,
      profilePhotoUrl: result.url, // Store Cloudinary URL
    }));

    alert("Profile photo uploaded successfully!");
  } catch (error) {
    alert("Failed to upload image: " + error.message);
    setImagePreview(null);
    e.target.value = "";
  } finally {
    setUploadingImage(false);
  }
};
```

### In Your JSX

```jsx
<div className="mb-3">
  <label htmlFor="profilePhoto" className="form-label">
    Profile Photo <span className="text-danger">*</span>
  </label>

  {/* Image preview */}
  {imagePreview && (
    <div className="mb-2 text-center">
      <img
        src={imagePreview}
        alt="Profile preview"
        className="img-thumbnail"
        style={{
          maxWidth: "200px",
          maxHeight: "200px",
          objectFit: "cover",
        }}
      />
      {uploadingImage && (
        <div className="mt-2">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="visually-hidden">Uploading...</span>
          </div>
          <span className="ms-2 text-muted">Uploading to cloud...</span>
        </div>
      )}
      {formData.profilePhotoUrl && !uploadingImage && (
        <div className="mt-2 text-success">
          <i className="bi bi-check-circle-fill me-1"></i>
          Image uploaded successfully!
        </div>
      )}
    </div>
  )}

  <input
    type="file"
    className="form-control"
    id="profilePhoto"
    name="profilePhoto"
    onChange={handleImageChange}
    accept="image/*"
    required
    disabled={uploadingImage}
  />
  <div className="form-text">
    <i className="bi bi-info-circle me-1"></i>
    Upload a profile picture (Max 5MB, JPG, PNG, GIF, WebP)
  </div>
</div>
```

## Cloudinary Service API

### `uploadImageToCloudinary(file, folder)`

Uploads an image to Cloudinary via the backend API.

**Parameters:**

- `file` (File): The image file to upload
- `folder` (String, optional): Cloudinary folder name (default: 'teacher-profiles')

**Returns:**

- `Promise<Object>`: Upload result containing:
  - `url`: Secure Cloudinary URL
  - `publicId`: Public ID for the uploaded image
  - `format`: Image format (jpg, png, etc.)
  - `width`: Image width in pixels
  - `height`: Image height in pixels

**Example:**

```javascript
const result = await uploadImageToCloudinary(file, "teacher-profiles");
console.log("Image URL:", result.url);
```

### `validateImageFile(file)`

Validates an image file before upload.

**Parameters:**

- `file` (File): The file to validate

**Returns:**

- `Object`: Validation result containing:
  - `valid` (Boolean): Whether the file is valid
  - `error` (String|null): Error message if invalid

**Validation Rules:**

- Maximum size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP

**Example:**

```javascript
const validation = validateImageFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}
```

### `deleteImageFromCloudinary(publicId)`

Deletes an image from Cloudinary.

**Parameters:**

- `publicId` (String): The public ID of the image to delete

**Returns:**

- `Promise<Object>`: Delete result

**Example:**

```javascript
await deleteImageFromCloudinary("teacher-profiles/abc123");
```

## Displaying Images

### From Teacher/Student Profile

When fetching teacher or student data, the `profilePhoto` field contains the Cloudinary URL:

```javascript
const teacher = await axios.get(`${API_BASE_URL}/teachers/${teacherId}`);
const profilePhotoUrl = teacher.data.teacher.profilePhoto;

// Display the image
<img src={profilePhotoUrl} alt="Tutor profile" className="profile-image" />;
```

### With Default Fallback

```javascript
const profilePhotoUrl = teacher.profilePhoto || "/default-avatar.png";

<img
  src={profilePhotoUrl}
  alt="Profile"
  onError={(e) => {
    e.target.src = "/default-avatar.png"; // Fallback if Cloudinary URL fails
  }}
/>;
```

## File Structure

```
funny-tutor-fe/
├── src/
│   ├── services/
│   │   └── cloudinaryService.js    # Cloudinary upload service
│   └── components/
│       └── auth/
│           ├── TeacherAuth.jsx     # Teacher registration with image upload ✅
│           └── StudentAuth.jsx     # Student registration with image upload ✅
```

## Error Handling

The service includes comprehensive error handling:

```javascript
try {
  const result = await uploadImageToCloudinary(file);
  // Success - use result.url
} catch (error) {
  // Error handling
  if (error.message.includes("size")) {
    // File too large
  } else if (error.message.includes("type")) {
    // Invalid file type
  } else {
    // Network or server error
  }
}
```

## Best Practices

1. **Always validate before upload**

   ```javascript
   const validation = validateImageFile(file);
   if (!validation.valid) {
     alert(validation.error);
     return;
   }
   ```

2. **Show loading state**

   ```javascript
   setUploadingImage(true);
   try {
     await uploadImageToCloudinary(file);
   } finally {
     setUploadingImage(false);
   }
   ```

3. **Provide visual feedback**

   - Show image preview immediately
   - Display upload progress
   - Show success/error messages

4. **Handle cleanup**

   ```javascript
   if (error) {
     setImagePreview(null);
     e.target.value = ""; // Reset file input
   }
   ```

5. **Disable submit during upload**
   ```javascript
   <button disabled={loading || uploadingImage}>Submit</button>
   ```

## Troubleshooting

### Image not uploading

1. Check browser console for errors
2. Verify backend API is running
3. Check Cloudinary credentials in backend `.env`
4. Ensure file meets validation requirements

### Image preview not showing

1. Verify FileReader is supported in browser
2. Check if file was successfully selected
3. Look for JavaScript errors in console

### "Failed to upload image" error

1. Check network connectivity
2. Verify backend `/api/upload-image` endpoint is accessible
3. Check backend logs for detailed error
4. Verify Cloudinary credentials

## Next Steps

To add image upload to other components:

1. Import the cloudinary service
2. Add state for upload status and preview
3. Create handler function for file selection
4. Add image preview UI
5. Update form submission to include Cloudinary URL

## Support

For issues or questions:

- Check backend logs for detailed errors
- Review Cloudinary dashboard for upload history
- Verify environment variables are set correctly
