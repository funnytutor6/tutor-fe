import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

const FindTeachers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [location, setLocation] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [priceType, setPriceType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // New states for connection requests
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageError, setRequestMessageError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [requestStatuses, setRequestStatuses] = useState({});

  // New states for video functionality
  const [teacherVideos, setTeacherVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeVideoTab, setActiveVideoTab] = useState("info");

  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps API
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
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
      !autocompleteRef.current
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
                }
              );

            autocompleteRef.current.addListener("place_changed", () => {
              const place = autocompleteRef.current.getPlace();
              if (place && (place.name || place.formatted_address)) {
                let cityName = place.name || place.formatted_address;

                if (place.address_components) {
                  const cityComponent = place.address_components.find(
                    (component) =>
                      component.types.includes("locality") ||
                      component.types.includes("administrative_area_level_2")
                  );
                  if (cityComponent) {
                    cityName = cityComponent.long_name;
                  }
                }

                setLocation(cityName);
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
            autocompleteRef.current
          );
          autocompleteRef.current = null;
        } catch (error) {
          console.error("Error cleaning up autocomplete:", error);
        }
      }
    };
  }, [isGoogleMapsLoaded]);

  // Fetch all teacher posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts when search criteria change
  useEffect(() => {
    filterPosts();
  }, [
    posts,
    searchQuery,
    selectedSubject,
    location,
    lessonType,
    priceType,
    minPrice,
    maxPrice,
  ]);

  // Check user authentication and type
  useEffect(() => {
    const checkUserAuth = () => {
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);

          if (user.role === "teacher") {
            setUserType("teacher");
          } else if (user.role === "student") {
            setUserType("student");
          } else {
            if (user.teacherId) {
              setUserType("teacher");
            } else if (user.studentId) {
              setUserType("student");
            } else {
              setUserType(null);
            }
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setCurrentUser(null);
          setUserType(null);
        }
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
    };

    checkUserAuth();
  }, []);

  // Check request statuses when posts are loaded (only for students)
  useEffect(() => {
    if (filteredPosts.length > 0 && currentUser && userType === "student") {
      checkRequestStatuses();
    }
  }, [filteredPosts, currentUser, userType]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(ENDPOINTS.GET_ALL_TEACHER_POSTS);
      setPosts(response.data?.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load Tutor posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts.filter((post) => {
      const searchMatch =
        !searchQuery ||
        post.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const subjectMatch =
        !selectedSubject ||
        post.subject?.toLowerCase().includes(selectedSubject.toLowerCase());

      const locationMatch =
        !location ||
        post.location?.toLowerCase().includes(location.toLowerCase()) ||
        post.townOrDistrict?.toLowerCase().includes(location.toLowerCase());

      const lessonTypeMatch = !lessonType || post.lessonType === lessonType;
      const priceTypeMatch = !priceType || post.priceType === priceType;

      const priceRangeMatch =
        (!minPrice || post.price >= parseFloat(minPrice)) &&
        (!maxPrice || post.price <= parseFloat(maxPrice));

      return (
        searchMatch &&
        subjectMatch &&
        locationMatch &&
        lessonTypeMatch &&
        priceTypeMatch &&
        priceRangeMatch
      );
    });

    setFilteredPosts(filtered);
  };

  const checkRequestStatuses = async () => {
    if (!currentUser || userType !== "student") return;

    const studentId = currentUser.studentId || currentUser.id;

    try {
      const statusPromises = filteredPosts.map((post) =>
        axios
          .get(`${API_BASE_URL}/posts/${post.id}/request-status/${studentId}`)
          .then((response) => {
            return { postId: post.id, ...response.data };
          })
          .catch((error) => {
            console.error(`Error checking status for post ${post.id}:`, error);
            return { postId: post.id, hasRequested: false, status: null };
          })
      );

      const statuses = await Promise.all(statusPromises);
      const statusMap = statuses.reduce((acc, status) => {
        acc[status.postId] = status;
        return acc;
      }, {});

      setRequestStatuses(statusMap);
    } catch (error) {
      console.error("Error checking request statuses:", error);
    }
  };

  // Function to get video embed URL
  const getVideoEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube URL conversion
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo URL conversion
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1].split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // If it's already an embed URL or other video format, return as is
    return url;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterPosts();
  };

  const handleViewProfile = async (post) => {
    try {
      const response = await api.get(`/api/posts/teachers/public/${post.id}`);

      let isConnected = false;
      console.log("response", response);

      if (currentUser && userType === "student") {
        const teacherPosts = filteredPosts.filter(
          (post) => post.teacherId === post.teacherId
        );
        isConnected = teacherPosts.some((post) => {
          const requestStatus = requestStatuses[post.id];
          return (
            requestStatus?.hasRequested && requestStatus?.status === "purchased"
          );
        });
      }

      const teacherData = {
        ...response.data?.data,
        isConnected,
      };

      setSelectedTeacher(teacherData);
      setShowProfileModal(true);
      setSelectedPost(post);
      setActiveVideoTab("info"); // Reset to info tab when opening modal

      if (teacherData.videoLinks) {
        const videos = [];

        // Collect all available video links
        if (teacherData.videoLinks?.link1) {
          videos.push({
            id: 1,
            title: "Sample Lesson 1",
            url: teacherData.videoLinks?.link1,
            description: "Tutor introduction and teaching methodology",
          });
        }

        if (teacherData.videoLinks?.link2) {
          videos.push({
            id: 2,
            title: "Sample Lesson 2",
            url: teacherData.videoLinks?.link2,
            description: "Advanced teaching techniques demonstration",
          });
        }

        if (teacherData.videoLinks?.link3) {
          videos.push({
            id: 3,
            title: "Sample Lesson 3",
            url: teacherData.videoLinks?.link3,
            description: "Student interaction and feedback session",
          });
        }

        setTeacherVideos(videos);
      } else {
        setTeacherVideos([]);
      }
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      toast.error("Failed to load Tutor profile");
    }
  };

  const handleConnectNow = (post) => {
    if (!currentUser) {
      toast.error("Please log in to connect with teachers");
      navigate("/login/student");
      return;
    }

    if (userType === "teacher") {
      toast.error(
        "Teachers cannot send connection requests. Please log in as a student to connect with other teachers."
      );
      return;
    }

    if (userType !== "student") {
      toast.error("Please log in as a student to connect with teachers");
      return;
    }

    const requestStatus = requestStatuses[post?.id];

    if (requestStatus?.hasRequested) {
      const statusText = {
        pending: "Your request is pending approval",
        purchased: "Tutor has your contact info and should contact you soon",
        rejected: "This request was declined",
      };
      const message =
        statusText[requestStatus.status] || "Request already sent";
      if (requestStatus.status === "purchased") {
        toast.success(message);
      } else if (requestStatus.status === "rejected") {
        toast.error(message);
      } else {
        toast(message, { icon: "⏳" });
      }
      return;
    }

    setSelectedPost(post);
    setShowRequestModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!currentUser || userType !== "student") {
      toast.error("Please log in as a student to send requests");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        studentId: currentUser.studentId || currentUser.id,
        teacherId: selectedPost.teacherId,
        postId: selectedPost.id,
        message: requestMessage,
      };

      const response = await api.post(
        `${ENDPOINTS.SEND_CONNECTION_REQUEST}`,
        requestData
      );

      toast.success(
        "Connection request sent successfully! The Tutor will be notified."
      );
      setShowRequestModal(false);
      setRequestMessage("");
      setRequestMessageError("");
      setSelectedPost(null);
      fetchPosts();

      checkRequestStatuses();
    } catch (error) {
      console.error("Error sending request:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const getConnectButtonText = (post) => {
    if (!currentUser) {
      return "Login to Connect";
    }

    if (userType === "teacher") {
      return "Login as Student";
    }

    if (userType === "student") {
      const requestStatus = requestStatuses[post?.id];

      if (post?.hasRequested) {
        return "Requested";
      }

      switch (requestStatus?.status) {
        case "pending":
          return "Request Sent";
        case "purchased":
          return "Connected";
        case "rejected":
          return "Declined";
        default:
          return "Connect Now";
      }
    }

    return "Connect Now";
  };

  const getConnectButtonClass = (post) => {
    if (!currentUser) {
      return "btn btn-outline-primary";
    }

    if (userType === "teacher") {
      return "btn btn-outline-secondary";
    }

    if (userType === "student") {
      const requestStatus = requestStatuses[post.id];

      if (!requestStatus?.hasRequested) {
        return "btn btn-success";
      }

      switch (requestStatus.status) {
        case "pending":
          return "btn btn-warning";
        case "purchased":
          return "btn btn-info";
        case "rejected":
          return "btn btn-secondary";
        default:
          return "btn btn-success";
      }
    }

    return "btn btn-success";
  };

  const isConnectButtonDisabled = (post) => {
    if (!currentUser) {
      return false;
    }

    if (userType === "teacher") {
      return false;
    }

    if (userType === "student") {
      const requestStatus = requestStatuses[post.id];
      return post?.hasRequested && requestStatus?.status !== "rejected";
    }

    return false;
  };

  const getUniqueSubjects = () => {
    const subjects = [
      ...new Set(posts?.map((post) => post.subject).filter(Boolean)),
    ];
    return subjects.sort();
  };

  return (
    <div className="find-teachers-page">
      {/* Hero Section */}
      <section className="search-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">
                Find Your Perfect Tutor
              </h1>
              <p className="lead mb-5">
                Discover experienced teachers offering personalized lessons.
                Filter by subject, location, and more to find the right match
                for your learning needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-search me-2"></i>
                      Search
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by keyword, subject, Tutor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-book me-2"></i>
                      Subject
                    </label>
                    <select
                      className="form-select"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">All Subjects</option>
                      {getUniqueSubjects().map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-geo-alt me-2"></i>
                      Location
                    </label>
                    <input
                      ref={locationInputRef}
                      type="text"
                      className="form-control"
                      placeholder="Enter city or location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-laptop me-2"></i>
                      Lesson Type
                    </label>
                    <select
                      className="form-select"
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      {/* <option value="both">Both</option> */}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-clock me-2"></i>
                      Price Type
                    </label>
                    <select
                      className="form-select"
                      value={priceType}
                      onChange={(e) => setPriceType(e.target.value)}
                    >
                      <option value="">All Price Types</option>
                      <option value="hourly">Per Hour</option>
                      <option value="daily">Per Day</option>
                      <option value="monthly">Per Month</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-currency-dollar me-2"></i>
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-currency-dollar me-2"></i>
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("");
                    setLocation("");
                    setLessonType("");
                    setPriceType("");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear Filters
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Search Teachers ({filteredPosts.length})
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Teachers List Section */}
      <section className="teachers-section">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading Tutor posts...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h4 className="mt-3">No teachers found</h4>
              <p className="text-muted">
                Try adjusting your search criteria or clear filters to see more
                results.
              </p>
            </div>
          ) : (
            <div className="teachers-list">
              {filteredPosts.map((post) => (
                <div key={post.id} className="teacher-card">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <div className="teacher-image">
                        {post.profilePhoto ? (
                          <img
                            src={`${post.profilePhoto}`}
                            alt={post.teacherName}
                          />
                        ) : (
                          <div className="placeholder-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                        {post.averageRating && (
                          <div className="rating-badge">
                            <i className="bi bi-star-fill"></i>
                            <span>{post.averageRating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="teacher-info">
                        <div className="teacher-header">
                          <h3>{post.headline}</h3>
                          <span className="subject-badge">{post.subject}</span>
                          <span
                            className={`lesson-type-badge ${post.lessonType}`}
                          >
                            {post.lessonType === "online" ? (
                              <>
                                <i className="bi bi-laptop me-1"></i>Online
                              </>
                            ) : post.lessonType === "in-person" ? (
                              <>
                                <i className="bi bi-person me-1"></i>In-Person
                              </>
                            ) : (
                              <>
                                <i className="bi bi-hybrid me-1"></i>Both
                              </>
                            )}
                          </span>
                        </div>
                        <div className="teacher-name">
                          <i className="bi bi-person-badge me-2"></i>
                          <strong>{post.teacherName}</strong>
                        </div>
                        <div className="details">
                          {post.location && (
                            <span>
                              <i className="bi bi-geo-alt"></i> {post.location}
                            </span>
                          )}
                          {post.townOrDistrict && (
                            <span>
                              <i className="bi bi-building"></i>{" "}
                              {post.townOrDistrict}
                            </span>
                          )}
                          <span>
                            <i className="bi bi-currency-dollar"></i> $
                            {post.price}/{post.priceType}
                          </span>
                        </div>
                        <p className="description">{post.description}</p>
                        <div className="reviews-summary">
                          {post.averageRating ? (
                            <>
                              <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star${i < Math.floor(post.averageRating)
                                      ? "-fill"
                                      : ""
                                      }`}
                                  ></i>
                                ))}
                              </div>
                              <span className="reviews-count">
                                {post.totalReviews} reviews
                              </span>
                            </>
                          ) : (
                            <span className="text-muted">No reviews yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="teacher-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleViewProfile(post)}
                        >
                          <i className="bi bi-person-lines-fill me-2"></i>
                          View Profile
                        </button>
                        <button
                          className={getConnectButtonClass(post)}
                          onClick={() => handleConnectNow(post)}
                          disabled={isConnectButtonDisabled(post)}
                        >
                          <i className="bi bi-telephone me-2"></i>
                          {getConnectButtonText(post)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced View Profile Modal with Videos */}
      {showProfileModal && selectedTeacher && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-badge me-2"></i>
                  Tutor Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowProfileModal(false);
                    setTeacherVideos([]);
                    setActiveVideoTab("info");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Navigation Tabs */}
                <ul className="nav nav-pills mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeVideoTab === "info" ? "active" : ""
                        }`}
                      onClick={() => setActiveVideoTab("info")}
                      type="button"
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      Tutor Info
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeVideoTab === "videos" ? "active" : ""
                        }`}
                      onClick={() => setActiveVideoTab("videos")}
                      type="button"
                    >
                      <i className="bi bi-play-circle me-2"></i>
                      Sample Videos
                      {teacherVideos.length > 0 && (
                        <span className="badge bg-primary ms-2">
                          {teacherVideos.length}
                        </span>
                      )}
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Teacher Info Tab */}
                  {activeVideoTab === "info" && (
                    <div className="row">
                      <div className="col-md-4 text-center">
                        <div className="profile-image-large">
                          {selectedTeacher.profilePhoto ? (
                            <img
                              src={`${selectedTeacher.profilePhoto}`}
                              alt={selectedTeacher.name}
                              className="rounded-circle w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="placeholder-avatar-large">
                              <i className="bi bi-person-fill"></i>
                            </div>
                          )}
                        </div>
                        <h4 className="mt-3">{selectedTeacher.name}</h4>
                        {selectedTeacher.isConnected ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Connected
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="bi bi-clock me-1"></i>
                            Not Connected
                          </span>
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="profile-info">
                          <div className="info-section">
                            <h6 className="section-title">
                              <i className="bi bi-info-circle me-2"></i>
                              Contact Information
                            </h6>
                            <div className="info-grid">
                              {selectedTeacher.isConnected ||
                                (currentUser?.hasPremium && currentUser?.role === "student") ? (
                                <>
                                  <div className="info-item">
                                    <label>Email:</label>
                                    <span>
                                      <a
                                        href={`mailto:${selectedTeacher.email}`}
                                        className="text-primary"
                                      >
                                        <i className="bi bi-envelope me-1"></i>
                                        {selectedTeacher.email}
                                      </a>
                                    </span>
                                  </div>
                                  {selectedTeacher.phoneNumber && (
                                    <div className="info-item">
                                      <label>Phone Number:</label>
                                      <span>
                                        <a
                                          href={`tel:${selectedTeacher.phoneNumber}`}
                                          className="text-primary"
                                        >
                                          <i className="bi bi-telephone me-1"></i>
                                          {selectedTeacher.phoneNumber}
                                        </a>
                                      </span>
                                    </div>
                                  )}
                                  {selectedTeacher.mobileNumber && (
                                    <div className="info-item">
                                      <label>Mobile Number:</label>
                                      <span>
                                        <a
                                          href={`tel:${selectedTeacher.mobileNumber}`}
                                          className="text-primary"
                                        >
                                          <i className="bi bi-phone me-1"></i>
                                          {selectedTeacher.mobileNumber}
                                        </a>
                                      </span>
                                    </div>
                                  )}
                                  <div className="info-item">
                                    <label>Location:</label>
                                    <span>
                                      {selectedTeacher?.cityOrTown ||
                                        "Not provided"}
                                    </span>
                                  </div>
                                  <div className="info-item">
                                    <label>Member Since:</label>
                                    <span>
                                      {new Date(
                                        selectedTeacher.created
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="info-item">
                                    <label>Email:</label>
                                    <span className="text-muted">
                                      <i className="bi bi-lock me-1"></i>
                                      Hidden - Connect to view
                                    </span>
                                  </div>
                                  <div className="info-item">
                                    <label>Phone Number:</label>
                                    <span className="text-muted">
                                      <i className="bi bi-lock me-1"></i>
                                      Hidden - Connect to view
                                    </span>
                                  </div>
                                  <div className="info-item">
                                    <label>Location:</label>
                                    <span>
                                      {selectedTeacher.cityOrTown ||
                                        "Not provided"}
                                    </span>
                                  </div>
                                  <div className="info-item">
                                    <label>Member Since:</label>
                                    <span>
                                      {new Date(
                                        selectedTeacher.created
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* About Section */}
                          {selectedTeacher.about && (
                            <div className="info-section mt-4">
                              <h6 className="section-title">
                                <i className="bi bi-person-lines-fill me-2"></i>
                                About
                              </h6>
                              <div className="about-content">
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                  {selectedTeacher.about}
                                </p>
                              </div>
                            </div>
                          )}

                          {!selectedTeacher.isConnected && (
                            <div className="alert alert-info mt-3">
                              <i className="bi bi-info-circle me-2"></i>
                              <strong>Connect to view contact details:</strong>
                              <p className="mb-0 mt-1">
                                Send a connection request to access this
                                Tutor's phone number and email address.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Videos Tab */}
                  {activeVideoTab === "videos" && (
                    <div className="videos-section">
                      {loadingVideos ? (
                        <div className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            style={{ width: "2rem", height: "2rem" }}
                          >
                            <span className="visually-hidden">
                              Loading videos...
                            </span>
                          </div>
                          <p className="mt-3">Loading sample videos...</p>
                        </div>
                      ) : teacherVideos.length > 0 ? (
                        <>
                          <div className="mb-4">
                            <h5 className="mb-3">
                              <i className="bi bi-play-circle-fill me-2 text-primary"></i>
                              Sample Teaching Videos
                            </h5>
                            <p className="text-muted">
                              Watch these sample videos to get a preview of this
                              Tutor's teaching style and methodology.
                            </p>
                          </div>
                          <div className="row">
                            {teacherVideos.map((video) => (
                              <div
                                key={video.id}
                                className="col-md-6 col-lg-4 mb-4"
                              >
                                <div className="video-card">
                                  <div
                                    className="video-thumbnail"
                                    onClick={() => handlePlayVideo(video)}
                                  >
                                    <div className="video-preview mt-4">
                                      <i className="bi bi-play-circle-fill"></i>
                                      <span>Click to Play</span>
                                    </div>
                                    <div className="video-overlay">
                                      <div className="play-button">
                                        <i className="bi bi-play-fill"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="video-info">
                                    <h6 className="video-title">
                                      {video.title}
                                    </h6>
                                    <p className="video-description">
                                      {video.description}
                                    </p>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handlePlayVideo(video)}
                                    >
                                      <i className="bi bi-play me-1"></i>
                                      Watch Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-camera-video display-1 text-muted"></i>
                          <h5 className="mt-3 text-muted">
                            No Sample Videos Available
                          </h5>
                          <p className="text-muted">
                            This Tutor hasn't uploaded any sample videos yet.
                            You can still connect with them to learn more about
                            their teaching methods.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowProfileModal(false);
                    setTeacherVideos([]);
                    setActiveVideoTab("info");
                  }}
                >
                  Close
                </button>
                {selectedTeacher.isConnected ? (
                  <div className="d-flex gap-2">
                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Send Email
                    </a>
                    {selectedTeacher.phoneNumber && (
                      <a
                        href={`tel:${selectedTeacher.phoneNumber}`}
                        className="btn btn-success"
                      >
                        <i className="bi bi-telephone me-2"></i>
                        Call Now
                      </a>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowProfileModal(false);

                      if (selectedPost) {
                        handleConnectNow(selectedPost);
                      }
                    }}
                    disabled={isConnectButtonDisabled(selectedPost)}
                  >
                    <i className="bi bi-telephone me-2"></i>
                    {getConnectButtonText(selectedPost)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoModal && selectedVideo && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content bg-dark">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-white">
                  <i className="bi bi-play-circle me-2"></i>
                  {selectedVideo.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowVideoModal(false);
                    setSelectedVideo(null);
                  }}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="video-player-container">
                  <iframe
                    src={getVideoEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-100"
                    style={{ height: "500px" }}
                  ></iframe>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <div className="me-auto">
                  <p className="text-light mb-0">{selectedVideo.description}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowVideoModal(false);
                    setSelectedVideo(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Request Modal */}
      {showRequestModal && selectedPost && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-plus me-2"></i>
                  Send Connection Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage("");
                    setSelectedPost(null);
                  }}
                ></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const validateInput = (text) => {
                    if (/\d/.test(text))
                      return "Numbers are not allowed in messages";
                    if (/@/.test(text))
                      return "@ symbol is not allowed in messages";

                    const domainPatterns = [
                      /\b\w+\.com\b/i,
                      /\b\w+\.org\b/i,
                      /\b\w+\.net\b/i,
                      /\b\w+\.edu\b/i,
                      /\b\w+\.gov\b/i,
                      /\b\w+\.co\b/i,
                      /\b\w+\.uk\b/i,
                      /\b\w+\.ca\b/i,
                      /\b\w+\.au\b/i,
                      /\b\w+\.de\b/i,
                      /\b\w+\.fr\b/i,
                      /\b\w+\.it\b/i,
                      /\b\w+\.es\b/i,
                      /\b\w+\.ru\b/i,
                      /\b\w+\.in\b/i,
                      /\b\w+\.jp\b/i,
                      /\b\w+\.cn\b/i,
                      /\b\w+\.br\b/i,
                      /\b\w+\.mx\b/i,
                      /\b\w+\.io\b/i,
                      /\b\w+\.app\b/i,
                      /\b\w+\.dev\b/i,
                      /\b\w+\.tech\b/i,
                      /\b\w+\.info\b/i,
                      /\b\w+\.biz\b/i,
                      /\b\w+\.me\b/i,
                      /\b\w+\.tv\b/i,
                      /\b\w+\.cc\b/i,
                      /\b\w+\.ly\b/i,
                      /\b\w+\.co\.uk\b/i,
                      /\b\w+\.com\.au\b/i,
                      /\b\w+\.co\.in\b/i,
                    ];

                    for (let pattern of domainPatterns) {
                      if (pattern.test(text))
                        return "Domain names are not allowed in messages";
                    }
                    return null;
                  };

                  const messageError = validateInput(requestMessage);
                  if (messageError) {
                    toast.error(messageError);
                    return;
                  }

                  handleSendRequest(e);
                }}
              >
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                      <div className="me-3">
                        {selectedPost.teacherPhoto ? (
                          <img
                            src={`${API_BASE_URL}${selectedPost.teacherPhoto}`}
                            alt={selectedPost.teacherName}
                            className="rounded-circle"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="bi bi-person-fill text-white fs-4"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-1">{selectedPost.headline}</h6>
                        <p className="mb-1 text-muted">
                          <strong>{selectedPost.teacherName}</strong> -{" "}
                          {selectedPost.subject}
                        </p>
                        <p className="mb-0 text-success">
                          <small>
                            ${selectedPost.price}/{selectedPost.priceType}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-chat-text me-2"></i>
                      Message to Tutor (Optional)
                    </label>
                    <textarea
                      className={`form-control ${requestMessageError ? "is-invalid" : ""}`}
                      rows="4"
                      value={requestMessage}
                      onChange={(e) => {
                        const value = e.target.value;

                        const validateInput = (text) => {
                          if (/\d/.test(text)) return "Numbers are not allowed";
                          if (/@/.test(text)) return "@ symbol is not allowed";

                          const domainPatterns = [
                            /\b\w+\.com\b/i,
                            /\b\w+\.org\b/i,
                            /\b\w+\.net\b/i,
                            /\b\w+\.edu\b/i,
                            /\b\w+\.gov\b/i,
                            /\b\w+\.co\b/i,
                            /\b\w+\.uk\b/i,
                            /\b\w+\.ca\b/i,
                            /\b\w+\.au\b/i,
                            /\b\w+\.de\b/i,
                            /\b\w+\.fr\b/i,
                            /\b\w+\.it\b/i,
                            /\b\w+\.es\b/i,
                            /\b\w+\.ru\b/i,
                            /\b\w+\.in\b/i,
                            /\b\w+\.jp\b/i,
                            /\b\w+\.cn\b/i,
                            /\b\w+\.br\b/i,
                            /\b\w+\.mx\b/i,
                            /\b\w+\.io\b/i,
                            /\b\w+\.app\b/i,
                            /\b\w+\.dev\b/i,
                            /\b\w+\.tech\b/i,
                            /\b\w+\.info\b/i,
                            /\b\w+\.biz\b/i,
                            /\b\w+\.me\b/i,
                            /\b\w+\.tv\b/i,
                            /\b\w+\.cc\b/i,
                            /\b\w+\.ly\b/i,
                            /\b\w+\.co\.uk\b/i,
                            /\b\w+\.com\.au\b/i,
                            /\b\w+\.co\.in\b/i,
                          ];

                          for (let pattern of domainPatterns) {
                            if (pattern.test(text))
                              return "Domain names are not allowed";
                          }

                          return null;
                        };

                        const validationError = validateInput(value);

                        if (validationError) {
                          setRequestMessage("");
                          setRequestMessageError(validationError);

                          // Clear error after 3 seconds
                          setTimeout(() => {
                            setRequestMessageError("");
                          }, 3000);

                          return;
                        }

                        setRequestMessageError("");
                        setRequestMessage(value);
                      }}
                      placeholder="Hi! I'm interested in your teaching services. I would like to learn..."
                    />
                    {requestMessageError && (
                      <div className="invalid-feedback d-block" style={{ marginTop: "0.25rem" }}>
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {requestMessageError}
                      </div>
                    )}
                    <div className="form-text">
                      A personalized message helps teachers understand your
                      learning needs better.
                      <br />
                      <small className="text-muted">
                        <i className="bi bi-shield-exclamation me-1"></i>
                        Numbers, @ symbol, and domain names are not allowed in
                        messages.
                      </small>
                    </div>
                  </div>

                  <div className="alert alert-info mb-2">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>How it works:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Your request will be sent to the Tutor</li>
                      <li>
                        You'll be notified when the Tutor views your contact
                        info
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestMessage("");
                      setRequestMessageError("");
                      setSelectedPost(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .find-teachers-page {
          padding-top: 80px;
        }

        .search-hero {
          padding: 3rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .search-section {
          padding: 1.5rem 0;
          margin-top: -30px;
        }

        .search-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-label {
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
        }

        .form-control,
        .form-select {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .teachers-section {
          padding: 2rem 0;
        }

        .teachers-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .teacher-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
        }

        .teacher-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .teacher-image {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          border: 3px solid #e2e8f0;
        }

        .teacher-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-avatar {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 1.5rem;
        }

        .rating-badge {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .rating-badge i {
          color: #fbbf24;
          font-size: 0.7rem;
        }

        .teacher-info {
          padding: 0 1rem;
        }

        .teacher-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .teacher-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #1e293b;
        }

        .teacher-name {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: #475569;
          font-size: 0.9rem;
        }

        .subject-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .lesson-type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .lesson-type-badge.online {
          background: #dcfce7;
          color: #166534;
        }

        .lesson-type-badge.in-person {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .lesson-type-badge.both {
          background: #fef3c7;
          color: #92400e;
        }

        .details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .details span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #64748b;
          font-size: 0.8rem;
        }

        .details i {
          color: #2563eb;
          font-size: 0.9rem;
        }

        .description {
          color: #475569;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .reviews-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 0.85rem;
        }

        .reviews-count {
          color: #64748b;
          font-size: 0.8rem;
        }

        .teacher-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .teacher-actions .btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .teacher-actions .btn-primary {
          background: #2563eb;
          border: none;
        }

        .teacher-actions .btn-success {
          background: #059669;
          border: none;
        }

        .teacher-actions .btn-warning {
          background: #d97706;
          border: none;
          color: white;
        }

        .teacher-actions .btn-info {
          background: #0891b2;
          border: none;
          color: white;
        }

        .teacher-actions .btn-secondary {
          background: #64748b;
          border: none;
        }

        .teacher-actions .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .teacher-actions .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .profile-image-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          border: 3px solid #e2e8f0;
        }

        .placeholder-avatar-large {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 3rem;
        }

        .profile-info {
          padding: 1rem 0;
        }

        .section-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .info-grid {
          display: grid;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-item label {
          font-weight: 500;
          color: #64748b;
          margin: 0;
        }

        .info-item span {
          color: #1e293b;
        }

        .about-content {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 3px solid #2563eb;
        }

        .about-content p {
          color: #475569;
          font-size: 0.95rem;
        }

        /* Video Styles */
        .videos-section {
          min-height: 400px;
        }

        .video-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .video-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .video-thumbnail {
          position: relative;
          height: 180px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }

        .video-preview {
          text-align: center;
        }

        .video-preview i {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .video-preview span {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          background: white;
          transform: scale(1.1);
        }

        .video-info {
          padding: 1rem;
        }

        .video-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .video-description {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .video-player-container {
          position: relative;
          background: #000;
        }

        .video-player-container iframe {
          border-radius: 0;
        }

        /* Navigation Pills */
        .nav-pills .nav-link {
          border-radius: 0.5rem;
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          color: #64748b;
          transition: all 0.3s ease;
        }

        .nav-pills .nav-link:hover {
          background-color: #f1f5f9;
          color: #2563eb;
        }

        .nav-pills .nav-link.active {
          background-color: #2563eb;
          color: white;
        }

        .nav-pills .nav-link .badge {
          font-size: 0.7rem;
        }

        .modal {
          backdrop-filter: blur(5px);
        }

        .modal-content {
          border-radius: 1rem;
          border: none;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          border-bottom: 1px solid #f1f5f9;
          padding: 1.5rem;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          border-top: 1px solid #f1f5f9;
          padding: 1.5rem;
        }

        .modal-xl {
          max-width: 1200px;
        }

        .alert {
          border-radius: 0.75rem;
          border: none;
        }

        .alert-info {
          background-color: #f0f9ff;
          color: #1e40af;
          border-left: 4px solid #3b82f6;
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

        @media (max-width: 768px) {
          .search-hero {
            padding: 2rem 0;
          }

          .search-section {
            margin-top: 0;
          }

          .search-card {
            padding: 1.5rem;
          }

          .teacher-image {
            width: 70px;
            height: 70px;
            margin-bottom: 1rem;
          }

          .teacher-info {
            padding: 0;
            margin-bottom: 1rem;
          }

          .teacher-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .teacher-actions {
            flex-direction: row;
          }

          .teacher-actions .btn {
            flex: 1;
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .details {
            flex-direction: column;
            gap: 0.5rem;
          }

          .profile-image-large {
            width: 120px;
            height: 120px;
          }

          .placeholder-avatar-large {
            font-size: 2rem;
          }

          .modal-dialog {
            margin: 1rem;
          }

          .modal-xl {
            max-width: calc(100% - 2rem);
          }

          .video-thumbnail {
            height: 150px;
          }

          .video-preview i {
            font-size: 2rem;
          }

          .play-button {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }

          .nav-pills .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .video-player-container iframe {
            height: 300px !important;
          }
        }

        @media (max-width: 576px) {
          .teacher-card {
            padding: 1rem;
          }

          .teacher-header h3 {
            font-size: 1rem;
          }

          .teacher-actions {
            flex-direction: column;
          }

          .search-card {
            padding: 1rem;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .video-card {
            margin-bottom: 1rem;
          }

          .video-thumbnail {
            height: 120px;
          }

          .video-preview i {
            font-size: 1.5rem;
          }

          .video-preview span {
            font-size: 0.8rem;
          }

          .video-player-container iframe {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FindTeachers;
