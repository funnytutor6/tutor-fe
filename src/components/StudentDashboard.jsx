import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { showDeleteConfirmToast } from "./common/ConfirmToast";
import { uploadService } from "../api/services/uploadService.js";
import { studentService } from "../api/services/studentService.js";
import { validateImageFile } from "../services/cloudinaryService";
import { subscriptionService } from "../api/services/subscriptionService";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";
import StudentConnectionRequests from "./StudentConnectionRequests";
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  // Post-related states
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    country: "",
    profilePhoto: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [postFormData, setPostFormData] = useState({
    lessonType: "",
    subject: "",
    headline: "",
    description: "",
    townOrCity: "",
    grade: "",
  });

  const [premiumData, setPremiumData] = useState({
    subject: "",
    email: user?.email || "",
    mobile: user?.phoneNumber || "",
    topix: "",
    descripton: "",
    ispayed: false,
  });

  const [studentPremiumStatus, setStudentPremiumStatus] = useState({
    hasPremium: false,
    isPaid: false,
    premiumData: null,
  });

  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [premiumErrors, setPremiumErrors] = useState({});
  const [postValidationErrors, setPostValidationErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const STRIPE_SERVER_URL = import.meta.env.VITE_STRIPE_SERVER_URL;

  // Contact validation function for posts
  const validateContactInfo = (text) => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePatterns = [
      /\b\d{10}\b/,
      /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/,
      /\(\d{3}\)\s?\d{3}[-.\s]\d{4}/,
      /\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/,
      /\b\d{3}[-.\s]\d{4}\b/,
      /\b\d{11,15}\b/,
    ];

    if (emailPattern.test(text)) {
      return "Email addresses are not allowed in this field";
    }

    for (let pattern of phonePatterns) {
      if (pattern.test(text)) {
        return "Phone numbers are not allowed in this field";
      }
    }

    return null;
  };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]',
      );
      if (existingScript) {
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBRVAGSgYeCWuZW_Lhy5V_bdr_0Tv1Q5ys&libraries=places`;
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            setIsGoogleMapsLoaded(true);
          }
        }, 100);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (
      isGoogleMapsLoaded &&
      locationInputRef.current &&
      !autocompleteRef.current &&
      showPostForm
    ) {
      const initTimer = setTimeout(() => {
        if (
          locationInputRef.current &&
          window.google?.maps?.places?.Autocomplete
        ) {
          try {
            autocompleteRef.current =
              new window.google.maps.places.Autocomplete(
                locationInputRef.current,
                {
                  types: ["(cities)"],
                  fields: ["name", "formatted_address", "address_components"],
                },
              );

            autocompleteRef.current.addListener("place_changed", () => {
              const place = autocompleteRef.current.getPlace();
              if (place && (place.name || place.formatted_address)) {
                let cityName = place.name || place.formatted_address;

                if (place.address_components) {
                  const cityComponent = place.address_components.find(
                    (component) =>
                      component.types.includes("locality") ||
                      component.types.includes("administrative_area_level_2"),
                  );
                  if (cityComponent) {
                    cityName = cityComponent.long_name;
                  }
                }

                setPostFormData((prev) => ({
                  ...prev,
                  townOrCity: cityName,
                }));
              }
            });
          } catch (error) {
            console.error("Error creating autocomplete:", error);
          }
        }
      }, 500);

      return () => clearTimeout(initTimer);
    }

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(
            autocompleteRef.current,
          );
          autocompleteRef.current = null;
        } catch (error) {
          console.error("Error cleaning up autocomplete:", error);
        }
      }
    };
  }, [isGoogleMapsLoaded, showPostForm]);

  useEffect(() => {
    // Check if user is logged in and is a student
    if (!user || user.role !== "student") {
      navigate("/login/student");
      return;
    }

    // Initialize with user data if available
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        country: user.country || "",
        profilePhoto: user.profilePhoto || "",
      });
      setImagePreview(user.profilePhoto || null);

      setPremiumData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }

    // Load data
    if (user && (user.id || user.studentId)) {
      loadProfileData();
      fetchMyPosts();
    }

    if (user?.email) {
      loadStudentPremiumStatus();
    }
  }, [user, navigate]);

  const loadProfileData = async () => {
    const userId = user?.id || user?.studentId;

    if (!userId) {
      console.error("No user ID found");
      return;
    }

    try {
      setLoading(true);
      const response = await studentService.getStudentById(userId);
      const studentData =
        response.data?.student || response.student || response;

      setProfileData({
        name: studentData?.name || "",
        email: studentData?.email || "",
        phoneNumber: studentData?.phoneNumber || "",
        location: studentData?.cityOrTown || "",
        country: studentData?.country || "",
        profilePhoto: studentData?.profilePhoto || "",
      });
      setImagePreview(studentData?.profilePhoto || null);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentPremiumStatus = async () => {
    try {
      const response = await api.get(ENDPOINTS.CHECK_STUDENT_PREMIUM_STATUS);
      setStudentPremiumStatus(response?.data?.data);

      // If premium is active, load invoice history
      if (response?.data?.data?.hasPremium && response?.data?.data?.isPaid) {
        loadInvoiceHistory();
      }
    } catch (error) {
      console.error("Error loading student premium status:", error);
    }
  };

  const loadInvoiceHistory = async () => {
    try {
      setLoadingInvoices(true);
      const response = await subscriptionService.getStudentInvoiceHistory();
      const invoices = response?.data || response;
      setInvoiceHistory(Array.isArray(invoices) ? invoices : []);
    } catch (error) {
      console.error("Error loading invoice history:", error);
      setInvoiceHistory([]);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleManagePaymentMethod = async () => {
    try {
      setLoadingPortal(true);
      const response =
        await subscriptionService.createStudentCustomerPortalSession();
      const portalUrl = response?.data?.url || response?.url;

      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        toast.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      toast.error(
        error.response?.data?.error || "Failed to open payment management",
      );
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleCancelSubscription = async (cancelAtPeriodEnd = true) => {
    const message = cancelAtPeriodEnd
      ? "Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period."
      : "Are you sure you want to cancel your subscription immediately? Access will be revoked right away.";

    if (!window.confirm(message)) {
      return;
    }

    try {
      setLoading(true);
      await subscriptionService.cancelStudentSubscription(cancelAtPeriodEnd);
      toast.success(
        cancelAtPeriodEnd
          ? "Subscription will be canceled at the end of the billing period"
          : "Subscription canceled immediately",
      );
      await loadStudentPremiumStatus();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionService.reactivateStudentSubscription();
      toast.success("Subscription reactivated successfully");
      await loadStudentPremiumStatus();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error(
        error.response?.data?.error || "Failed to reactivate subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, isPaid, currentPeriodEnd) => {
    console.log(status, isPaid, currentPeriodEnd);
    if (!status && isPaid) {
      return <span className="badge bg-info">Legacy Payment</span>;
    }

    const now = new Date();
    const periodEnd = currentPeriodEnd ? new Date(currentPeriodEnd) : null;
    const isActive = status === "active" && periodEnd && periodEnd > now;

    if (isActive) {
      return <span className="badge bg-success">Active</span>;
    } else if (status === "canceled") {
      return <span className="badge bg-secondary">Canceled</span>;
    } else if (status === "past_due") {
      return <span className="badge bg-warning">Past Due</span>;
    } else if (status === "unpaid") {
      return <span className="badge bg-danger">Unpaid</span>;
    } else if (status === "trialing") {
      return <span className="badge bg-info">Trialing</span>;
    } else {
      return <span className="badge bg-secondary">Inactive</span>;
    }
  };

  const formatDetailedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch student's posts
  const fetchMyPosts = async () => {
    const studentId = user?.studentId || user?.id;
    if (!studentId) return;

    try {
      setPostsLoading(true);
      const response = await api.get(`${API_BASE_URL}/api/posts/student`);
      setMyPosts(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching my posts:", error);
      setPostError("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  // Handle post input changes with validation
  const handlePostInputChange = (field, value) => {
    setPostFormData({ ...postFormData, [field]: value });

    if (["subject", "headline", "description"].includes(field)) {
      const error = validateContactInfo(value);
      setPostValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Create new post
  const handleCreatePost = () => {
    setPostFormData({
      lessonType: "",
      subject: "",
      headline: "",
      description: "",
      townOrCity: "",
      grade: "",
    });
    setEditingPost(null);
    setPostValidationErrors({});
    setShowPostForm(true);
  };

  // Edit existing post
  const handleEditPost = (post) => {
    setPostFormData({
      lessonType: post.lessonType,
      subject: post.subject,
      headline: post.headline,
      description: post.description,
      townOrCity: post.townOrCity || "",
      grade: post.grade || "",
    });
    setEditingPost(post);
    setPostValidationErrors({});
    setShowPostForm(true);
  };

  // Submit post form
  const handlePostFormSubmit = async (e) => {
    e.preventDefault();

    // Validate contact info in restricted fields
    const errors = {
      subject: validateContactInfo(postFormData.subject),
      headline: validateContactInfo(postFormData.headline),
      description: validateContactInfo(postFormData.description),
    };

    setPostValidationErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== null);

    if (hasErrors) {
      return;
    }

    try {
      setPostsLoading(true);

      const payload = {
        studentId: user.studentId || user.id,
        lessonType: postFormData.lessonType,
        subject: postFormData.subject,
        headline: postFormData.headline,
        description: postFormData.description,
        townOrCity: postFormData.townOrCity,
        grade: postFormData.grade,
      };

      if (editingPost) {
        await axios.put(`${API_BASE_URL}/api/posts/${editingPost.id}`, payload);
        toast.success("Post updated successfully!");
      } else {
        await api.post(`/api/posts/student`, payload);
        toast.success("Post created successfully!");
      }

      setShowPostForm(false);
      fetchMyPosts(); // Refresh posts
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(error.response?.data?.error || "Failed to save post");
    } finally {
      setPostsLoading(false);
    }
  };

  // Delete post confirmation
  const handleDeletePost = async (postId) => {
    const confirmed = await showDeleteConfirmToast("this post");

    if (!confirmed) {
      return;
    }

    toast.loading("Deleting post...", { id: "delete-post" });
    try {
      await api.delete(`/api/posts/student/${postId}`);
      fetchMyPosts(); // Refresh posts
      toast.success("Post deleted successfully!", { id: "delete-post" });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", { id: "delete-post" });
      setPostError("Failed to delete post");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  // Validation functions
  const validateForm = () => {
    const errors = {};

    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Email is invalid";
    }

    if (!profileData.country.trim()) {
      errors.country = "Country is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePremiumForm = () => {
    const errors = {};

    // if (!premiumData.subject.trim()) {
    //   errors.subject = "Subject is required";
    // }

    if (!premiumData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(premiumData.email)) {
      errors.email = "Email is invalid";
    }

    if (!premiumData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    }

    // if (!premiumData.topix.trim()) {
    //   errors.topix = "Topic is required";
    // }

    // if (!premiumData.descripton.trim()) {
    //   errors.descripton = "Description is required";
    // }

    setPremiumErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePremiumInputChange = (e) => {
    const { name, value } = e.target;
    setPremiumData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (premiumErrors[name]) {
      setPremiumErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    const userId = user?.id || user?.studentId;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        name: profileData.name,
        email: profileData.email,
        cityOrTown: profileData.location,
        country: profileData.country,
      };

      if (profileData.profilePhoto) {
        updateData.profilePhoto = profileData.profilePhoto;
      }

      const response = await studentService.updateStudent(userId, updateData);

      if (response.success || response.data?.success) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        await loadProfileData();
        updateProfile({
          ...user,
          profilePhoto: profileData?.profilePhoto || null,
          name: profileData?.name || "",
          email: profileData?.email || "",
          cityOrTown: profileData?.location || "",
          country: profileData?.country || "",
        });
      } else {
        toast.error(
          response.error || response.data?.error || "Failed to update profile",
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
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
      const result = await uploadService.uploadImage(file, "student-profiles");
      const imageUrl = result.data?.url || result.url || result.data?.data?.url;
      setProfileData((prev) => ({
        ...prev,
        profilePhoto: imageUrl,
      }));
      setImagePreview(imageUrl);
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        "Failed to upload image: " + (error.message || "Unknown error"),
      );
      setImagePreview(profileData.profilePhoto || null);
      e.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePremiumSubmit = async () => {
    if (!validatePremiumForm()) {
      return;
    }

    try {
      setPremiumLoading(true);

      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);

      const body = {
        studentData: {
          email: premiumData.email,
          subject: premiumData?.subject || "",
          mobile: premiumData.mobile,
          topix: premiumData.topix || "",
          descripton: premiumData.descripton || "",
        },
      };

      const response = await api.post(
        ENDPOINTS.CREATE_STUDENT_PREMIUM_CHECKOUT,
        body,
      );
      const result = await stripe.redirectToCheckout({
        sessionId: response?.data?.data?.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Student premium payment error:", error);
      toast.error(error.message || "Failed to initiate premium payment");
    } finally {
      setPremiumLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        country: user.country || "",
        profilePhoto: user.profilePhoto || "",
      });
      setImagePreview(user.profilePhoto || null);
    } else {
      loadProfileData();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClosePremiumModal = () => {
    setShowPremiumModal(false);
    setPremiumErrors({});
    setPremiumData({
      subject: "",
      email: user?.email || "",
      mobile: "",
      topix: "",
      descripton: "",
      ispayed: false,
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: "80px" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          top: "90px",
          position: "fixed",
          height: "calc(100vh - 80px)",
          overflowY: "auto",
          borderRight: "1px solid #dee2e6",
        }}
      >
        <div
          style={{
            textAlign: "center",
            paddingBottom: "20px",
            borderBottom: "1px solid #dee2e6",
            marginBottom: "20px",
          }}
        >
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#0d6efd",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
                color: "white",
                fontSize: "2rem",
              }}
            >
              <i className="bi bi-person-fill"></i>
            </div>
          )}
          <h5>{profileData.name || user?.name || "Student Name"}</h5>
          <p style={{ color: "#6c757d", margin: 0 }}>Student</p>
          {studentPremiumStatus.hasPremium && studentPremiumStatus.isPaid && (
            <span
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "4px 12px",
                borderRadius: "15px",
                fontSize: "0.75rem",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "8px",
              }}
            >
              <i className="bi bi-star-fill"></i>
              Premium Member
            </span>
          )}
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ margin: "5px 0" }}>
            <button
              style={{
                color: activeTab === "profile" ? "white" : "#333",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                background: activeTab === "profile" ? "#0d6efd" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setActiveTab("profile")}
            >
              <i className="bi bi-person me-2"></i>
              Profile
            </button>
          </li>
          <li style={{ margin: "5px 0" }}>
            <button
              style={{
                color: activeTab === "posts" ? "white" : "#333",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                background: activeTab === "posts" ? "#0d6efd" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setActiveTab("posts")}
            >
              <i className="bi bi-file-post me-2"></i>
              My Posts ({myPosts.length})
            </button>
          </li>
          <li style={{ margin: "5px 0" }}>
            <button
              style={{
                color: activeTab === "connection-requests" ? "white" : "#333",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                background:
                  activeTab === "connection-requests" ? "#0d6efd" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setActiveTab("connection-requests")}
            >
              <i className="bi bi-envelope-paper me-2"></i>
              Connection Requests
            </button>
          </li>
          <li style={{ margin: "5px 0" }}>
            <button
              style={{
                color: activeTab === "subscriptions" ? "white" : "#333",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                background: activeTab === "subscriptions" ? "#0d6efd" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setActiveTab("subscriptions")}
            >
              <i className="bi bi-star me-2"></i>
              Subscriptions
            </button>
          </li>
          <li style={{ marginTop: "20px" }}>
            <button
              style={{
                color: "#dc3545",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "280px", padding: "20px" }}>
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <h1>
            {activeTab === "profile"
              ? "Profile Management"
              : activeTab === "posts"
                ? "My Posts"
                : activeTab === "connection-requests"
                  ? "Connection Requests"
                  : "Subscriptions"}
          </h1>
        </div>

        <div style={{ backgroundColor: "white" }}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div
              style={{
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h5 style={{ margin: 0 }}>Profile Information</h5>
                {!isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div className="btn-group">
                    <button
                      className="btn btn-success"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <i className="bi bi-x-lg me-2"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Form */}
              {/* Profile Photo Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <label className="form-label">Profile Photo</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      padding: "1rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid #0d6efd",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            backgroundColor: "#0d6efd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "3rem",
                          }}
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>
                      )}
                      {isEditing && (
                        <label
                          htmlFor="profile-photo-upload"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            backgroundColor: "#0d6efd",
                            color: "white",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            border: "3px solid white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                          title="Change photo"
                        >
                          <i className="bi bi-camera-fill"></i>
                        </label>
                      )}
                      <input
                        type="file"
                        id="profile-photo-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={!isEditing || uploadingImage}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h6 style={{ margin: 0, marginBottom: "0.5rem" }}>
                        {isEditing ? "Update Profile Photo" : "Profile Photo"}
                      </h6>
                      {isEditing ? (
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.875rem",
                              color: "#6c757d",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Click the camera icon to upload a new photo
                          </p>
                          {uploadingImage && (
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                          )}
                          <small
                            style={{
                              display: "block",
                              color: "#6c757d",
                              marginTop: "0.25rem",
                            }}
                          >
                            <i className="bi bi-info-circle me-1"></i>
                            Supported formats: JPG, PNG, GIF (Max 5MB)
                          </small>
                        </div>
                      ) : (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.875rem",
                            color: "#6c757d",
                          }}
                        >
                          Your profile photo will be visible to teachers
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        validationErrors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? "#f8f9fa" : "white",
                      }}
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">
                        {validationErrors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${
                        validationErrors.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? "#f8f9fa" : "white",
                      }}
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">
                        {validationErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      // onChange={handleInputChange}
                      readOnly={true}
                      placeholder="Enter your phone number"
                      style={{
                        backgroundColor: !isEditing ? "#f8f9fa" : "white",
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Location/City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="Enter your city or location"
                      style={{
                        backgroundColor: !isEditing ? "#f8f9fa" : "white",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        validationErrors.country ? "is-invalid" : ""
                      }`}
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="Enter your country"
                      style={{
                        backgroundColor: !isEditing ? "#f8f9fa" : "white",
                      }}
                    />
                    {validationErrors.country && (
                      <div className="invalid-feedback">
                        {validationErrors.country}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isEditing && (
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6 style={{ marginBottom: "0.5rem" }}>
                    <i className="bi bi-info-circle me-2"></i>
                    Profile Tips
                  </h6>
                  <ul
                    style={{
                      marginBottom: 0,
                      fontSize: "0.875rem",
                      color: "#6c757d",
                    }}
                  >
                    <li>Keep your profile information up to date</li>
                    <li>Include your location to find nearby teachers</li>
                    <li>Provide a phone number for easier communication</li>
                    <li>Make sure your email is accurate for notifications</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div
              style={{
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "2rem",
              }}
            >
              {/* Posts Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <h5 style={{ margin: 0 }}>My Learning Posts</h5>
                  <p style={{ color: "#6c757d", margin: "0.5rem 0 0 0" }}>
                    Manage your tutoring requests and learning opportunities
                  </p>
                </div>
                {myPosts.length >= 2 && !user?.hasPremium ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => setActiveTab("subscriptions")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-star-fill"></i>
                    Subscribe to Create More
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleCreatePost}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Create New Post
                  </button>
                )}
              </div>

              {/* Error Alert */}
              {postError && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {postError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setPostError("")}
                  ></button>
                </div>
              )}

              {/* Posts List */}
              {postsLoading ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <div className="spinner-border text-primary"></div>
                  <p style={{ marginTop: "1rem" }}>Loading posts...</p>
                </div>
              ) : myPosts.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 0",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                  }}
                >
                  <i
                    className="bi bi-inbox"
                    style={{
                      fontSize: "4rem",
                      color: "#6c757d",
                      marginBottom: "1rem",
                    }}
                  ></i>
                  <h4 style={{ color: "#6c757d" }}>No posts yet</h4>
                  <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
                    You haven't created any learning posts yet. Click 'Create
                    New Post' to get started!
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreatePost}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #e9ecef",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      {/* Post Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              marginBottom: "0.75rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                background:
                                  post.lessonType === "online"
                                    ? "#dbeafe"
                                    : post.lessonType === "in-person"
                                      ? "#dcfce7"
                                      : "#fef3c7",
                                color:
                                  post.lessonType === "online"
                                    ? "#1d4ed8"
                                    : post.lessonType === "in-person"
                                      ? "#16a34a"
                                      : "#92400e",
                              }}
                            >
                              <i
                                className={`bi ${
                                  post.lessonType === "online"
                                    ? "bi-laptop"
                                    : post.lessonType === "in-person"
                                      ? "bi-geo-alt"
                                      : "bi-hybrid"
                                } me-1`}
                              ></i>
                              {post.lessonType === "online"
                                ? "Online"
                                : post.lessonType === "in-person"
                                  ? "In-Person"
                                  : "Both"}
                            </span>
                            <span
                              style={{
                                background: "#f3e8ff",
                                color: "#7c3aed",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {post.subject}
                            </span>
                            {post.grade && (
                              <span
                                style={{
                                  background: "#e0f2fe",
                                  color: "#0369a1",
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "0.375rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                <i className="bi bi-mortarboard me-1"></i>
                                {post.grade === "student"
                                  ? "K-12"
                                  : post.grade === "university-student"
                                    ? "University"
                                    : "Adult Learner"}
                              </span>
                            )}
                          </div>
                          <small style={{ color: "#6c757d" }}>
                            {formatDate(post.created)}
                          </small>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditPost(post)}
                            title="Edit post"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete post"
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div style={{ marginBottom: "1rem" }}>
                        <h5
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            color: "#1e293b",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {post.headline}
                        </h5>
                        <p
                          style={{
                            color: "#475569",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                            lineHeight: "1.5",
                          }}
                        >
                          {post.description}
                        </p>

                        {post.townOrCity && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.75rem",
                              color: "#64748b",
                            }}
                          >
                            <i
                              className="bi bi-geo-alt"
                              style={{ color: "#2563eb" }}
                            ></i>
                            {post.townOrCity}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connection Requests Tab */}
          {activeTab === "connection-requests" && (
            <div
              style={{
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <h5 style={{ margin: 0 }}>Sent Connection Requests</h5>
                  <p style={{ color: "#6c757d", margin: "0.5rem 0 0 0" }}>
                    View and manage your connection requests to teachers
                  </p>
                </div>
              </div>
              <StudentConnectionRequests
                studentId={user?.id || user?.studentId}
              />
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div
              style={{
                border: "none",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "2rem",
              }}
            >
              <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {/* Premium Status Banner */}
                {studentPremiumStatus.hasPremium &&
                studentPremiumStatus.isPaid ? (
                  <>
                    {/* Subscription Status Card */}
                    <div
                      style={{
                        padding: "2rem",
                        borderRadius: "15px",
                        border: "2px solid #10b981",
                        background:
                          "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              background: "#10b981",
                              color: "white",
                            }}
                          >
                            <i className="bi bi-check-circle-fill"></i>
                          </div>
                          <div>
                            <h5 style={{ margin: 0, fontWeight: "700" }}>
                              Premium Active{" "}
                              {getStatusBadge(
                                studentPremiumStatus.subscriptionStatus,
                                studentPremiumStatus.isPaid,
                                studentPremiumStatus.currentPeriodEnd,
                              )}
                            </h5>
                            <p style={{ margin: 0, opacity: 0.8 }}>
                              {studentPremiumStatus.subscriptionPlan?.name ||
                                "Premium Student Subscription"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "700",
                              color: "#10b981",
                            }}
                          >
                            $
                            {studentPremiumStatus.subscriptionPlan?.amount ||
                              studentPremiumStatus.paymentAmount ||
                              15}
                            <span
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "400",
                                opacity: 0.8,
                              }}
                            >
                              /month
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Details Grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {studentPremiumStatus.paymentDate && (
                          <div
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              padding: "1rem",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.75rem",
                                opacity: 0.7,
                                marginBottom: "0.25rem",
                              }}
                            >
                              Last Payment
                            </div>
                            <div style={{ fontWeight: "600" }}>
                              {formatDetailedDate(
                                studentPremiumStatus.paymentDate,
                              )}
                            </div>
                          </div>
                        )}
                        {studentPremiumStatus.nextPaymentDate && (
                          <div
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              padding: "1rem",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.75rem",
                                opacity: 0.7,
                                marginBottom: "0.25rem",
                              }}
                            >
                              Next Payment
                            </div>
                            <div style={{ fontWeight: "600" }}>
                              {formatDetailedDate(
                                studentPremiumStatus.nextPaymentDate,
                              )}
                            </div>
                            {studentPremiumStatus.daysRemaining !== null &&
                              studentPremiumStatus.daysRemaining > 0 && (
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#059669",
                                    marginTop: "0.25rem",
                                  }}
                                >
                                  {studentPremiumStatus.daysRemaining} days
                                  remaining
                                </div>
                              )}
                          </div>
                        )}
                        {studentPremiumStatus.currentPeriodStart && (
                          <div
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              padding: "1rem",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.75rem",
                                opacity: 0.7,
                                marginBottom: "0.25rem",
                              }}
                            >
                              Period Start
                            </div>
                            <div style={{ fontWeight: "600" }}>
                              {formatDetailedDate(
                                studentPremiumStatus.currentPeriodStart,
                              )}
                            </div>
                          </div>
                        )}
                        {studentPremiumStatus.currentPeriodEnd && (
                          <div
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              padding: "1rem",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.75rem",
                                opacity: 0.7,
                                marginBottom: "0.25rem",
                              }}
                            >
                              Period End
                            </div>
                            <div style={{ fontWeight: "600" }}>
                              {formatDetailedDate(
                                studentPremiumStatus.currentPeriodEnd,
                              )}
                            </div>
                            {studentPremiumStatus.daysRemaining !== null &&
                              studentPremiumStatus.daysRemaining > 0 && (
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#059669",
                                    marginTop: "0.25rem",
                                  }}
                                >
                                  {calculateDaysRemaining(
                                    studentPremiumStatus.currentPeriodEnd,
                                  )}{" "}
                                  days left
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Cancel at Period End Warning */}
                      {studentPremiumStatus.cancelAtPeriodEnd ? (
                        <div
                          className="alert alert-warning"
                          style={{ marginBottom: "1rem" }}
                        >
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          This subscription is scheduled to cancel at the end of
                          the current billing period.
                        </div>
                      ) : null}

                      {/* Management Actions */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          onClick={handleManagePaymentMethod}
                          disabled={loadingPortal}
                        >
                          {loadingPortal ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Opening...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-credit-card me-2"></i>
                              Manage Payment Method
                            </>
                          )}
                        </button>
                        {studentPremiumStatus.subscriptionStatus === "active" &&
                          !studentPremiumStatus.cancelAtPeriodEnd && (
                            <>
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleCancelSubscription(true)}
                                disabled={loading}
                              >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancel at Period End
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleCancelSubscription(false)}
                                disabled={loading}
                              >
                                <i className="bi bi-x-octagon me-2"></i>
                                Cancel Immediately
                              </button>
                            </>
                          )}
                        {studentPremiumStatus.subscriptionStatus ===
                          "canceled" ||
                        studentPremiumStatus.cancelAtPeriodEnd ? (
                          <button
                            className="btn btn-success"
                            onClick={handleReactivateSubscription}
                            disabled={loading}
                          >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Reactivate Subscription
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Detailed Subscription Information */}
                    {studentPremiumStatus.premiumData && (
                      <div
                        className="card"
                        style={{
                          marginBottom: "2rem",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Subscription Details
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <p>
                                <strong>Subscription ID:</strong>{" "}
                                {studentPremiumStatus.premiumData
                                  .stripeSubscriptionId ? (
                                  <code>
                                    {studentPremiumStatus.premiumData.stripeSubscriptionId.substring(
                                      0,
                                      20,
                                    )}
                                    ...
                                  </code>
                                ) : (
                                  <span className="text-muted">
                                    N/A (Legacy Payment)
                                  </span>
                                )}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                {getStatusBadge(
                                  studentPremiumStatus.subscriptionStatus,
                                  studentPremiumStatus.isPaid,
                                  studentPremiumStatus.currentPeriodEnd,
                                )}
                              </p>
                              <p>
                                <strong>Payment Amount:</strong> $
                                {studentPremiumStatus.paymentAmount ||
                                  studentPremiumStatus.subscriptionPlan
                                    ?.amount ||
                                  15}
                              </p>
                              {studentPremiumStatus.premiumData.subject && (
                                <p>
                                  <strong>Subject:</strong>{" "}
                                  {studentPremiumStatus.premiumData.subject}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>Created:</strong>{" "}
                                {formatDetailedDate(
                                  studentPremiumStatus.premiumData.created,
                                )}
                              </p>
                              <p>
                                <strong>Last Updated:</strong>{" "}
                                {formatDetailedDate(
                                  studentPremiumStatus.premiumData.updated,
                                )}
                              </p>
                              {studentPremiumStatus.premiumData.canceledAt && (
                                <p>
                                  <strong>Canceled At:</strong>{" "}
                                  {formatDetailedDate(
                                    studentPremiumStatus.premiumData.canceledAt,
                                  )}
                                </p>
                              )}
                              {studentPremiumStatus.premiumData.mobile && (
                                <p>
                                  <strong>Mobile:</strong>{" "}
                                  {studentPremiumStatus.premiumData.mobile}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Invoice History */}
                    <div
                      className="card"
                      style={{
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-receipt me-2"></i>
                          Payment History
                        </h6>
                      </div>
                      <div className="card-body">
                        {loadingInvoices ? (
                          <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm"></div>
                            <p className="mt-2">Loading invoices...</p>
                          </div>
                        ) : invoiceHistory.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Status</th>
                                  <th>Period</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoiceHistory.map((invoice) => (
                                  <tr key={invoice.id}>
                                    <td>
                                      {invoice.created
                                        ? formatDetailedDate(invoice.created)
                                        : "N/A"}
                                    </td>
                                    <td>
                                      {invoice.currency} {invoice.amount}
                                    </td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          invoice.status === "paid"
                                            ? "bg-success"
                                            : invoice.status === "open"
                                              ? "bg-warning"
                                              : "bg-danger"
                                        }`}
                                      >
                                        {invoice.status?.toUpperCase() || "N/A"}
                                      </span>
                                    </td>
                                    <td>
                                      {invoice.periodStart && invoice.periodEnd
                                        ? `${formatDetailedDate(
                                            invoice.periodStart,
                                          )} - ${formatDetailedDate(
                                            invoice.periodEnd,
                                          )}`
                                        : "N/A"}
                                    </td>
                                    <td>
                                      {invoice.hostedInvoiceUrl && (
                                        <a
                                          href={invoice.hostedInvoiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          <i className="bi bi-download me-1"></i>
                                          View
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-muted text-center py-3">
                            No payment history available
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1rem",
                          color: "white",
                          fontSize: "2rem",
                        }}
                      >
                        <i className="bi bi-star-fill"></i>
                      </div>
                      <h3
                        style={{
                          color: "#333",
                          fontWeight: "700",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Premium Learning Experience
                      </h3>
                      <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
                        Get verified, unlimited posts, and free trial sessions
                      </p>
                    </div>

                    {/* Premium Pricing */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "2rem 0",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          padding: "2rem",
                          borderRadius: "15px",
                          textAlign: "center",
                          maxWidth: "400px",
                          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <div style={{ marginBottom: "1.5rem" }}>
                          <h4
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "700",
                              marginBottom: "1rem",
                            }}
                          >
                            Premium Subscription
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "3rem",
                                fontWeight: "800",
                                lineHeight: 1,
                              }}
                            >
                              $15
                            </span>
                            <span style={{ fontSize: "1rem", opacity: 0.8 }}>
                              per month
                            </span>
                          </div>
                        </div>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            textAlign: "left",
                          }}
                        >
                          <li
                            style={{
                              padding: "0.75rem 0",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.2)",
                              fontSize: "0.95rem",
                            }}
                          >
                            <i
                              className="bi bi-check-circle-fill me-2"
                              style={{ color: "#10b981" }}
                            ></i>
                            Verified Student Badge
                          </li>
                          <li
                            style={{
                              padding: "0.75rem 0",
                              borderBottom:
                                "1px solid rgba(255, 255, 255, 0.2)",
                              fontSize: "0.95rem",
                            }}
                          >
                            <i
                              className="bi bi-check-circle-fill me-2"
                              style={{ color: "#10b981" }}
                            ></i>
                            Unlimited Posts
                          </li>
                          <li
                            style={{
                              padding: "0.75rem 0",
                              fontSize: "0.95rem",
                            }}
                          >
                            <i
                              className="bi bi-check-circle-fill me-2"
                              style={{ color: "#10b981" }}
                            ></i>
                            Direct Contact Visibility
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          padding: "2rem",
                          borderRadius: "15px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                          }}
                        >
                          <i className="bi bi-gem"></i>
                          <span>PREMIUM</span>
                        </div>
                        <h5 style={{ marginBottom: "1rem", fontWeight: "700" }}>
                          Ready to Get Started?
                        </h5>
                        <p style={{ marginBottom: "1.5rem", opacity: 0.9 }}>
                          Join thousands of verified students with unlimited
                          learning opportunities
                        </p>
                        <button
                          style={{
                            background: "white",
                            color: "#667eea",
                            border: "none",
                            padding: "12px 30px",
                            borderRadius: "25px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowPremiumModal(true)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 6px 20px rgba(255, 255, 255, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 4px 15px rgba(255, 255, 255, 0.3)";
                          }}
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          Pay $15 & Get Premium
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Post Form Modal */}
      {showPostForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => setShowPostForm(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "15px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "15px 15px 0 0",
              }}
            >
              <h5
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {editingPost ? "Edit Post" : "Create New Post"}
              </h5>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  opacity: 0.8,
                  padding: 0,
                }}
                onClick={() => setShowPostForm(false)}
                onMouseEnter={(e) => (e.target.style.opacity = "1")}
                onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handlePostFormSubmit}>
              <div style={{ padding: "1.5rem" }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Lesson Type *</label>
                    <select
                      className="form-select"
                      value={postFormData.lessonType}
                      onChange={(e) =>
                        setPostFormData({
                          ...postFormData,
                          lessonType: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select lesson type</option>
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Grade Level *</label>
                    <select
                      className="form-select"
                      value={postFormData.grade}
                      onChange={(e) =>
                        setPostFormData({
                          ...postFormData,
                          grade: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select grade level</option>
                      <option value="student">Student (K-12)</option>
                      <option value="university-student">
                        University Student
                      </option>
                      <option value="adult">Adult Learner</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        postValidationErrors.subject ? "is-invalid" : ""
                      }`}
                      value={postFormData.subject}
                      onChange={(e) =>
                        handlePostInputChange("subject", e.target.value)
                      }
                      placeholder="Enter subject"
                      required
                    />
                    {postValidationErrors.subject && (
                      <div className="invalid-feedback">
                        {postValidationErrors.subject}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Headline *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        postValidationErrors.headline ? "is-invalid" : ""
                      }`}
                      value={postFormData.headline}
                      onChange={(e) =>
                        handlePostInputChange("headline", e.target.value)
                      }
                      placeholder="e.g., Looking for Expert Math Tutor"
                      required
                    />
                    {postValidationErrors.headline && (
                      <div className="invalid-feedback">
                        {postValidationErrors.headline}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${
                        postValidationErrors.description ? "is-invalid" : ""
                      }`}
                      rows="4"
                      value={postFormData.description}
                      onChange={(e) =>
                        handlePostInputChange("description", e.target.value)
                      }
                      placeholder="Describe what kind of tutoring you're looking for..."
                      required
                    ></textarea>
                    {postValidationErrors.description && (
                      <div className="invalid-feedback">
                        {postValidationErrors.description}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Town or City</label>
                    <input
                      ref={locationInputRef}
                      type="text"
                      className="form-control"
                      value={postFormData.townOrCity}
                      onChange={(e) =>
                        setPostFormData({
                          ...postFormData,
                          townOrCity: e.target.value,
                        })
                      }
                      placeholder="Start typing your city..."
                      autoComplete="off"
                    />
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#6c757d",
                        marginTop: "0.25rem",
                      }}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      Start typing to see city suggestions
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPostForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={postsLoading}
                >
                  {postsLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {editingPost ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`bi ${
                          editingPost ? "bi-check-circle" : "bi-plus-circle"
                        } me-2`}
                      ></i>
                      {editingPost ? "Update Post" : "Create Post"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div
              className="modal-content"
              style={{
                border: "none",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderBottom: "none",
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5 style={{ fontWeight: "600", margin: 0 }}>
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  Get Premium Subscription
                </h5>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    opacity: 0.8,
                  }}
                  onClick={handleClosePremiumModal}
                  disabled={premiumLoading}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    padding: "1.5rem",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", color: "#0d6efd" }}>
                    $15{" "}
                    <small style={{ fontSize: "1rem", color: "#6c757d" }}>
                      /month
                    </small>
                  </div>
                  <p style={{ color: "#6c757d", margin: 0 }}>
                    Cancel anytime •
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    {/* <div className="mb-3">
                      <label className="form-label">Subject *</label>
                      <select
                        className={`form-control ${
                          premiumErrors.subject ? "is-invalid" : ""
                        }`}
                        name="subject"
                        value={premiumData.subject}
                        onChange={handlePremiumInputChange}
                      >
                        <option value="">Select a subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Biology">Biology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Computer Science">
                          Computer Science
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      {premiumErrors.subject && (
                        <div className="invalid-feedback">
                          {premiumErrors.subject}
                        </div>
                      )}
                    </div> */}

                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className={`form-control ${
                          premiumErrors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={premiumData.email}
                        onChange={handlePremiumInputChange}
                        readOnly={true}
                        placeholder="Enter your email"
                      />
                      {premiumErrors.email && (
                        <div className="invalid-feedback">
                          {premiumErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    {/* <div className="mb-3">
                      <label className="form-label">Topic *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          premiumErrors.topix ? "is-invalid" : ""
                        }`}
                        name="topix"
                        value={premiumData.topix}
                        onChange={handlePremiumInputChange}
                        placeholder="Specific topic you need help with"
                      />
                      {premiumErrors.topix && (
                        <div className="invalid-feedback">
                          {premiumErrors.topix}
                        </div>
                      )}
                    </div> */}

                    {/* <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className={`form-control ${
                          premiumErrors.descripton ? "is-invalid" : ""
                        }`}
                        name="descripton"
                        value={premiumData.descripton}
                        onChange={handlePremiumInputChange}
                        placeholder="Describe your learning goals and what you expect from the tutor"
                        rows="4"
                      />
                      {premiumErrors.descripton && (
                        <div className="invalid-feedback">
                          {premiumErrors.descripton}
                        </div>
                      )}
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          premiumErrors.mobile ? "is-invalid" : ""
                        }`}
                        name="mobile"
                        value={premiumData.mobile}
                        onChange={handlePremiumInputChange}
                        readOnly={true}
                        placeholder="Enter your mobile number"
                      />
                      {premiumErrors.mobile && (
                        <div className="invalid-feedback">
                          {premiumErrors.mobile}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#e7f1ff",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="bi bi-shield-check"
                    style={{
                      fontSize: "2rem",
                      color: "#0d6efd",
                      marginRight: "1rem",
                    }}
                  ></i>
                  <div>
                    <small style={{ fontWeight: "bold" }}>Secure Payment</small>
                    <br />
                    <small style={{ color: "#6c757d" }}>
                      Your payment is processed securely by Stripe. We don't
                      store your payment information.
                    </small>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "1rem 2rem",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClosePremiumModal}
                  disabled={premiumLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "0.375rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={handlePremiumSubmit}
                  disabled={premiumLoading}
                >
                  {premiumLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Pay $15 with Stripe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            position: relative;
            height: auto;
          }

          .main-content {
            margin-left: 0;
          }

          .post-card {
            padding: 1rem;
          }

          .post-header {
            flex-direction: column;
            gap: 1rem;
          }

          .post-actions {
            align-self: flex-end;
          }

          .modal-dialog {
            margin: 1rem;
            width: calc(100% - 2rem);
          }

          .premium-card {
            padding: 1.5rem;
          }

          .modal-body {
            padding: 1rem;
          }

          .modal-footer {
            padding: 1rem;
            flex-direction: column;
          }

          .modal-footer .btn {
            width: 100%;
          }
        }

        .pac-container {
          background-color: white !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #dee2e6 !important;
          margin-top: 2px !important;
          font-family: inherit !important;
          z-index: 9999 !important;
        }

        .pac-item {
          padding: 12px 15px !important;
          border-bottom: 1px solid #f1f3f4 !important;
          cursor: pointer !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        .pac-item:hover {
          background-color: #f8f9fa !important;
        }

        .pac-item-selected,
        .pac-item:hover {
          background-color: #e7f1ff !important;
        }

        .pac-matched {
          font-weight: 600 !important;
          color: #2563eb !important;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          outline: none;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        .invalid-feedback {
          display: block;
        }

        .is-invalid {
          border-color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
