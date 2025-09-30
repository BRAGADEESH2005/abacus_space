import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaEdit,
  FaBuilding,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaImage,
  FaSave,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaSearch,
  FaTimes,
  FaUpload,
  FaSpinner,
  FaExclamationTriangle,
  FaCode,
  FaInfoCircle,
} from "react-icons/fa";
import { MdSpaceDashboard, MdLocationCity } from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  // Property code statistics
  const [propertyCodeStats, setPropertyCodeStats] = useState(null);

  // Predefined locations list - synchronized with backend
  const predefinedLocations = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Gurgaon",
    "Noida",
    "Kolkata",
    "Ahmedabad",
    "Kochi",
    "Coimbatore",
    "Indore",
    "Jaipur",
    "Lucknow",
    "Nagpur",
    "Surat",
    "Vadodara",
    "Visakhapatnam",
    "Bhubaneswar",
  ];

  // Location code mapping for preview
  const locationCodes = {
    Bangalore: "BLR",
    Mumbai: "MUM",
    Delhi: "DEL",
    Hyderabad: "HYD",
    Chennai: "CHN",
    Pune: "PUN",
    Gurgaon: "GUR",
    Noida: "NOI",
    Kolkata: "KOL",
    Ahmedabad: "AMD",
    Kochi: "KOC",
    Coimbatore: "COI",
    Indore: "IND",
    Jaipur: "JAI",
    Lucknow: "LCK",
    Nagpur: "NAG",
    Surat: "SUR",
    Vadodara: "VAD",
    Visakhapatnam: "VIZ",
    Bhubaneswar: "BBR",
  };

  // Updated newListing state - removed propertyCode since it's auto-generated
  const [newListing, setNewListing] = useState({
    title: "",
    type: "Office",
    location: "",
    area: "",
    price: "",
    images: [],
    features: [""],
    viewsRange: [100, 300],
  });

  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editSelectedFiles, setEditSelectedFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [editImagePreviewUrls, setEditImagePreviewUrls] = useState([]);

  // Get base URL from environment variables
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  // Configure axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Helper function to get location code
  const getLocationCode = (location) => {
    return locationCodes[location] || location.substring(0, 3).toUpperCase();
  };

  // Helper function to get type code
  const getTypeCode = (type) => {
    return type === "Office" ? "O" : type === "Retail" ? "R" : "C";
  };

  // Updated validation function for new listing - removed propertyCode validation
  const validateNewListing = () => {
    const errors = {};

    // Check required fields
    if (!newListing.title.trim()) {
      errors.title = "Property title is required";
    }
    if (!newListing.location) {
      errors.location = "Location must be selected";
    }
    if (!newListing.area.trim()) {
      errors.area = "Area is required";
    }
    if (!newListing.price.trim()) {
      errors.price = "Price is required";
    }

    // Check features - at least one non-empty feature
    const validFeatures = newListing.features.filter(
      (feature) => feature.trim() !== ""
    );
    if (validFeatures.length === 0) {
      errors.features = "At least one feature is required";
    }

    // Check images - at least one image must be uploaded
    if (selectedFiles.length === 0) {
      errors.images = "At least one image is required";
    }

    return errors;
  };

  // Updated validation function for editing listing - propertyCode is readonly
  const validateEditListing = () => {
    const errors = {};

    // Check required fields
    if (!editingListing.title.trim()) {
      errors.title = "Property title is required";
    }
    if (!editingListing.location) {
      errors.location = "Location must be selected";
    }
    if (!editingListing.area.trim()) {
      errors.area = "Area is required";
    }
    if (!editingListing.price.trim()) {
      errors.price = "Price is required";
    }
    // Note: propertyCode validation removed since it's immutable

    // Check features - at least one non-empty feature
    const validFeatures = editingListing.features.filter(
      (feature) => feature.trim() !== ""
    );
    if (validFeatures.length === 0) {
      errors.features = "At least one feature is required";
    }

    // Check images - must have existing images or new images selected
    const hasExistingImages =
      editingListing.images && editingListing.images.length > 0;
    const hasNewImages = editSelectedFiles.length > 0;

    if (!hasExistingImages && !hasNewImages) {
      errors.images = "At least one image is required";
    }

    return errors;
  };

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadListings();
      loadPropertyCodeStats();
    }
  }, []);

  // Load listings from backend
  const loadListings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch listings
      const listingsResponse = await api.get("/listings?limit=100");
      if (listingsResponse.data.success) {
        setListings(listingsResponse.data.data);
        setFilteredListings(listingsResponse.data.data);
      }

      // Fetch available locations and types
      const [locationsResponse, typesResponse] = await Promise.all([
        api.get("/listings/locations"),
        api.get("/listings/types"),
      ]);

      if (locationsResponse.data.success) {
        setAvailableLocations(locationsResponse.data.data);
      }

      if (typesResponse.data.success) {
        setAvailableTypes(typesResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading listings:", error);
      setError(error.response?.data?.message || "Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  };

  // Load property code statistics
  const loadPropertyCodeStats = async () => {
    try {
      const response = await api.get("/listings/stats/property-codes");
      if (response.data.success) {
        setPropertyCodeStats(response.data.data);
      }
    } catch (error) {
      console.error("Error loading property code stats:", error);
      // Don't show error for stats as it's not critical
    }
  };

  // Filter listings based on search term and filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.propertyCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((listing) => listing.type === selectedType);
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (listing) => listing.location === selectedLocation
      );
    }

    setFilteredListings(filtered);
  }, [searchTerm, selectedType, selectedLocation, listings]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLocation("all");
  };

  // Handle file selection for new listing
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);

    // Clear image validation error if files are selected
    if (files.length > 0) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // Handle file selection for editing listing
  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setEditSelectedFiles(files);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setEditImagePreviewUrls(previewUrls);

    // Clear image validation error if files are selected
    if (files.length > 0) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // Upload images to Cloudinary
  const uploadImages = async (files, propertyCode = "") => {
    try {
      setUploadingImages(true);
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      if (propertyCode) {
        formData.append("propertyCode", propertyCode);
      }

      const response = await axios.post(
        `${API_BASE_URL}/images/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        return response.data.data.urls;
      } else {
        throw new Error(response.data.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload images"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  // In useAdminLogic.js, replace the handleLogin function:
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuthenticated", "true");
        loadListings();
        loadPropertyCodeStats();
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("Unable to connect to server. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setLoginData({ username: "", password: "" });
    setActiveTab("listings");
    clearFilters();
    setSelectedFiles([]);
    setEditSelectedFiles([]);
    setImagePreviewUrls([]);
    setEditImagePreviewUrls([]);
    setValidationErrors({});
    setPropertyCodeStats(null);
  };

  const handleInputChange = (e, isNewListing = false) => {
    const { name, value } = e.target;

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    if (isNewListing) {
      setNewListing((prev) => ({ ...prev, [name]: value }));
    } else if (editingListing) {
      setEditingListing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (
    index,
    value,
    field,
    isNewListing = false
  ) => {
    if (isNewListing) {
      setNewListing((prev) => {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return { ...prev, [field]: newArray };
      });
    } else if (editingListing) {
      setEditingListing((prev) => {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return { ...prev, [field]: newArray };
      });
    }

    // Clear features validation error when user types
    if (field === "features" && value.trim() !== "") {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  const addArrayItem = (field, isNewListing = false) => {
    if (isNewListing) {
      setNewListing((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    } else if (editingListing) {
      setEditingListing((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    }
  };

  const removeArrayItem = (index, field, isNewListing = false) => {
    const currentData = isNewListing ? newListing : editingListing;
    const remainingFeatures = currentData[field]
      .filter((_, i) => i !== index)
      .filter((item) => item.trim() !== "");

    if (field === "features" && remainingFeatures.length === 0) {
      alert(
        "You must have at least one feature. Please add a feature before removing this one."
      );
      return;
    }

    if (isNewListing) {
      setNewListing((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else if (editingListing) {
      setEditingListing((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  // Remove existing image from editing listing
  const removeExistingImage = (index) => {
    const remainingExistingImages = editingListing.images.filter(
      (_, i) => i !== index
    );
    const hasNewImages = editSelectedFiles.length > 0;

    if (remainingExistingImages.length === 0 && !hasNewImages) {
      alert(
        "You must have at least one image. Please upload a new image before removing this one."
      );
      return;
    }

    setEditingListing((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    if (remainingExistingImages.length > 0 || hasNewImages) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // Remove preview image from new listing
  const removePreviewImage = (index) => {
    const remainingFiles = selectedFiles.filter((_, i) => i !== index);

    if (remainingFiles.length === 0) {
      alert(
        "You must have at least one image. Please select another image before removing this one."
      );
      return;
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreviewUrls(newUrls);

    URL.revokeObjectURL(imagePreviewUrls[index]);
  };

  // Remove preview image from edit listing
  const removeEditPreviewImage = (index) => {
    const remainingNewFiles = editSelectedFiles.filter((_, i) => i !== index);
    const hasExistingImages =
      editingListing.images && editingListing.images.length > 0;

    if (remainingNewFiles.length === 0 && !hasExistingImages) {
      alert(
        "You must have at least one image. Please keep this image or upload another one."
      );
      return;
    }

    const newFiles = editSelectedFiles.filter((_, i) => i !== index);
    const newUrls = editImagePreviewUrls.filter((_, i) => i !== index);
    setEditSelectedFiles(newFiles);
    setEditImagePreviewUrls(newUrls);

    URL.revokeObjectURL(editImagePreviewUrls[index]);
  };

  // Updated handleCreateListing - removed propertyCode logic
  const handleCreateListing = async (e) => {
    e.preventDefault();

    const errors = validateNewListing();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors({});

      let imageUrls = [];

      if (selectedFiles.length > 0) {
        // Don't pass propertyCode since it will be auto-generated
        imageUrls = await uploadImages(selectedFiles);
      }

      // Prepare listing data - removed propertyCode
      const listingData = {
        title: newListing.title.trim(),
        type: newListing.type,
        location: newListing.location,
        area: newListing.area.trim(),
        price: newListing.price.trim(),
        images: imageUrls,
        features: newListing.features.filter(
          (feature) => feature.trim() !== ""
        ),
        viewsRange: [
          parseInt(newListing.viewsRange[0]),
          parseInt(newListing.viewsRange[1]),
        ],
      };

      const response = await api.post("/listings", listingData);

      if (response.data.success) {
        const createdListing = response.data.data;
        alert(
          `Listing created successfully!\nProperty Code: ${createdListing.propertyCode}`
        );

        // Reset form - removed propertyCode
        setNewListing({
          title: "",
          type: "Office",
          location: "",
          area: "",
          price: "",
          images: [],
          features: [""],
          viewsRange: [100, 300],
        });

        imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setImagePreviewUrls([]);

        await loadListings();
        await loadPropertyCodeStats();
        setActiveTab("listings");
      } else {
        throw new Error(response.data.message || "Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      setError(error.message || "Failed to create listing");
      alert(`Error: ${error.message || "Failed to create listing"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleUpdateListing
  const handleUpdateListing = async (e) => {
    e.preventDefault();

    const errors = validateEditListing();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setValidationErrors({});

      let imageUrls = [...(editingListing.images || [])];

      if (editSelectedFiles.length > 0) {
        const newImageUrls = await uploadImages(
          editSelectedFiles,
          editingListing.propertyCode
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Prepare listing data - propertyCode will be removed by backend
      const listingData = {
        ...editingListing,
        images: imageUrls,
        features: editingListing.features.filter(
          (feature) => feature.trim() !== ""
        ),
      };

      const response = await api.put(
        `/listings/${editingListing._id}`,
        listingData
      );

      if (response.data.success) {
        alert("Listing updated successfully!");

        setEditingListing(null);
        editImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        setEditSelectedFiles([]);
        setEditImagePreviewUrls([]);

        await loadListings();
        setActiveTab("listings");
      } else {
        throw new Error(response.data.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      setError(error.message || "Failed to update listing");
      alert(`Error: ${error.message || "Failed to update listing"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced handleDeleteListing with better feedback
  const handleDeleteListing = async (id) => {
    const listing = listings.find((l) => l._id === id);
    const confirmMessage = listing
      ? `Are you sure you want to delete this listing?\n\nProperty: ${listing.title}\nCode: ${listing.propertyCode}\n\nThis action cannot be undone and will also delete all associated images.`
      : "Are you sure you want to delete this listing?";

    if (window.confirm(confirmMessage)) {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.delete(`/listings/${id}`);

        if (response.data.success) {
          const deletedData = response.data.data;
          let message = "Listing deleted successfully!";

          if (deletedData.cleanup) {
            message += `\n\nCleanup Summary:`;
            message += `\n• Images cleaned: ${deletedData.cleanup.cleanedImages}/${deletedData.cleanup.totalImages}`;
            if (deletedData.cleanup.failedCleanup > 0) {
              message += `\n• Failed to clean: ${deletedData.cleanup.failedCleanup} images`;
            }
          }

          alert(message);
          await loadListings();
          await loadPropertyCodeStats();
        } else {
          throw new Error(response.data.message || "Failed to delete listing");
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
        setError(error.message || "Failed to delete listing");
        alert(`Error: ${error.message || "Failed to delete listing"}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditListing = (listing) => {
    setEditingListing({ ...listing });
    setActiveTab("edit");
    setEditSelectedFiles([]);
    setEditImagePreviewUrls([]);
    setValidationErrors({});
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      editImagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <FaShieldAlt />
            </div>
            <h1>Admin Panel</h1>
            <p>Please enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="username">
                <FaUser className="admin-form-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">
                <FaLock className="admin-form-icon" />
                Password
              </label>
              <div className="admin-password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="admin-login-error">{loginError}</div>
            )}

            <button type="submit" className="admin-login-btn">
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-container">
          <div className="admin-header-content">
            <div className="admin-header-left">
              <FaShieldAlt className="admin-icon" />
              <div>
                <h1>Admin Panel</h1>
                <p>Manage your property listings</p>
              </div>
            </div>
            <button
              className="admin-logout-btn"
              onClick={() => navigate("/admin/leads")}
            >
              <FaUser />
              Manage Leads
            </button>
            <button onClick={handleLogout} className="admin-logout-btn">
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="admin-loading-overlay">
            <div className="admin-loading-content">
              <FaSpinner className="admin-loading-spinner" />
              <p>{uploadingImages ? "Uploading images..." : "Loading..."}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="admin-error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>
              <FaTimes />
            </button>
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${
              activeTab === "listings" ? "admin-tab-active" : ""
            }`}
            onClick={() => setActiveTab("listings")}
          >
            <BiFilterAlt />
            Manage Listings
          </button>
          <button
            className={`admin-tab-btn ${
              activeTab === "create" ? "admin-tab-active" : ""
            }`}
            onClick={() => {
              setActiveTab("create");
              setValidationErrors({});
            }}
          >
            <FaPlus />
            Create New Listing
          </button>
          {editingListing && (
            <button
              className={`admin-tab-btn ${
                activeTab === "edit" ? "admin-tab-active" : ""
              }`}
              onClick={() => setActiveTab("edit")}
            >
              <FaEdit />
              Edit Listing
            </button>
          )}
          {/* New Stats Tab */}
          <button
            className={`admin-tab-btn ${
              activeTab === "stats" ? "admin-tab-active" : ""
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <FaCode />
            Property Codes
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "listings" && (
            <div className="admin-listings-management">
              <div className="admin-section-header">
                <h2>Existing Listings</h2>
                <p>Manage and edit your property listings</p>
              </div>

              {/* Search and Filter Section */}
              <div className="admin-listings-filters">
                <div className="admin-filters-header">
                  <h3 className="admin-filters-title">
                    <BiFilterAlt className="admin-filters-icon" />
                    Search & Filter Listings
                  </h3>
                </div>

                <div className="admin-search-section">
                  <div className="admin-search-bar">
                    <FaSearch className="admin-search-icon" />
                    <input
                      type="text"
                      placeholder="Search by title, property code, location, or area..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        className="admin-clear-search"
                        onClick={() => setSearchTerm("")}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                <div className="admin-filter-controls">
                  <div className="admin-filter-group">
                    <label>
                      <MdLocationCity className="admin-form-icon" />
                      Property Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      {availableTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === "Co-Working"
                            ? "Co-Working"
                            : `${type} Space`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-filter-group">
                    <label>
                      <FaMapMarkerAlt className="admin-form-icon" />
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {availableLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="admin-reset-filters"
                    onClick={clearFilters}
                  >
                    <FaTimes />
                    Clear Filters
                  </button>
                </div>

                {/* Results Info */}
                <div className="admin-results-info">
                  <div className="admin-results-count">
                    <span className="admin-count-number">
                      {filteredListings.length}
                    </span>
                    <span className="admin-count-text">
                      {filteredListings.length === 1 ? "listing" : "listings"}{" "}
                      found
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-listings-table">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <div key={listing._id} className="admin-listing-row">
                      <div className="admin-listing-info">
                        <img
                          src={
                            listing.images && listing.images.length > 0
                              ? listing.images[0]
                              : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
                          }
                          alt={listing.title}
                        />
                        <div className="admin-listing-details">
                          <h3>{listing.title}</h3>
                          <p>
                            <FaMapMarkerAlt /> {listing.location} |{" "}
                            {listing.type}
                          </p>
                          <p className="admin-property-code">
                            <FaCode /> {listing.propertyCode}
                          </p>
                          <p className="admin-listing-area">
                            <MdSpaceDashboard /> {listing.area}
                          </p>
                          <span className="admin-price">{listing.price}</span>
                        </div>
                      </div>
                      <div className="admin-listing-actions">
                        <button
                          onClick={() => startEditListing(listing)}
                          className="admin-btn-edit"
                          disabled={isLoading}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="admin-btn-delete"
                          disabled={isLoading}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-no-results">
                    <FaSearch className="admin-no-results-icon" />
                    <h3>No listings found</h3>
                    <p>
                      {searchTerm ||
                      selectedType !== "all" ||
                      selectedLocation !== "all"
                        ? "Try adjusting your search criteria or filters"
                        : "No listings available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="admin-create-listing">
              <div className="admin-section-header">
                <h2>Create New Listing</h2>
                <p>Add a new property to your listings</p>

                {/* Property Code Auto-generation Info */}
                <div className="admin-info-banner">
                  <FaInfoCircle className="admin-info-icon" />
                  <div>
                    <strong>Property Code Auto-Generation:</strong>
                    <p>
                      Property codes are automatically generated based on
                      location and type (e.g., BLR-C-001 for Bangalore
                      Co-Working #1)
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleCreateListing}
                className="admin-listing-form"
              >
                <div className="admin-form-grid">
                  <div
                    className={`admin-form-group ${
                      validationErrors.title ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaBuilding className="admin-form-icon" />
                      Property Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newListing.title}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Enter property title"
                      required
                    />
                    {validationErrors.title && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.title}
                      </div>
                    )}
                  </div>
                  <div className="admin-form-group">
                    <label>
                      <MdLocationCity className="admin-form-icon" />
                      Property Type *
                    </label>
                    <select
                      name="type"
                      value={newListing.type}
                      onChange={(e) => handleInputChange(e, true)}
                    >
                      <option value="Office">Office Space</option>
                      <option value="Retail">Retail Space</option>
                      <option value="Co-Working">Co-Working</option>
                    </select>
                    <small className="admin-field-hint">
                      Code: {getTypeCode(newListing.type)}
                    </small>
                  </div>
                  {/* UPDATED: Location Dropdown */}
                  <div
                    className={`admin-form-group ${
                      validationErrors.location ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaMapMarkerAlt className="admin-form-icon" />
                      Location *
                    </label>
                    <select
                      name="location"
                      value={newListing.location}
                      onChange={(e) => handleInputChange(e, true)}
                      required
                    >
                      <option value="">Select Location</option>
                      {predefinedLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    {validationErrors.location && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.location}
                      </div>
                    )}
                    {newListing.location && (
                      <small className="admin-field-hint">
                        Preview Code: {getLocationCode(newListing.location)}-
                        {getTypeCode(newListing.type)}-XXX
                      </small>
                    )}
                  </div>
                  <div
                    className={`admin-form-group ${
                      validationErrors.area ? "error" : ""
                    }`}
                  >
                    <label>
                      <MdSpaceDashboard className="admin-form-icon" />
                      Area *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={newListing.area}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="e.g., 2500 sq ft"
                      required
                    />
                    {validationErrors.area && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.area}
                      </div>
                    )}
                  </div>
                  <div
                    className={`admin-form-group ${
                      validationErrors.price ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaRupeeSign className="admin-form-icon" />
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={newListing.price}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="e.g., ₹1,50,000/month"
                      required
                    />
                    {validationErrors.price && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.price}
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label>
                      <FaEye className="admin-form-icon" />
                      Views Range
                    </label>
                    <div className="admin-views-range">
                      <div className="admin-range-input">
                        <label>Minimum Views</label>
                        <input
                          type="number"
                          min="0"
                          max="999999"
                          value={newListing.viewsRange[0]}
                          onChange={(e) => {
                            const minValue = parseInt(e.target.value) || 0;
                            setNewListing((prev) => ({
                              ...prev,
                              viewsRange: [minValue, prev.viewsRange[1]],
                            }));
                          }}
                          onBlur={(e) => {
                            // Only auto-adjust on blur if min > max
                            const minValue = parseInt(e.target.value) || 0;
                            if (minValue > newListing.viewsRange[1]) {
                              setNewListing((prev) => ({
                                ...prev,
                                viewsRange: [minValue, minValue + 100], // Set max to min + 100
                              }));
                            }
                          }}
                          placeholder="100"
                        />
                      </div>
                      <div className="admin-range-separator">to</div>
                      <div className="admin-range-input">
                        <label>Maximum Views</label>
                        <input
                          type="number"
                          min="0"
                          max="999999"
                          value={newListing.viewsRange[1]}
                          onChange={(e) => {
                            const maxValue = parseInt(e.target.value) || 0;
                            setNewListing((prev) => ({
                              ...prev,
                              viewsRange: [prev.viewsRange[0], maxValue],
                            }));
                          }}
                          onBlur={(e) => {
                            // Only auto-adjust on blur if max < min
                            const maxValue = parseInt(e.target.value) || 0;
                            if (maxValue < newListing.viewsRange[0]) {
                              setNewListing((prev) => ({
                                ...prev,
                                viewsRange: [
                                  Math.max(0, maxValue - 100),
                                  maxValue,
                                ], // Set min to max - 100
                              }));
                            }
                          }}
                          placeholder="300"
                        />
                      </div>
                    </div>
                    <small className="admin-field-hint">
                      <FaInfoCircle /> Random views will be generated between{" "}
                      {newListing.viewsRange[0]} and {newListing.viewsRange[1]}{" "}
                      for this listing
                      {newListing.viewsRange[0] > newListing.viewsRange[1] && (
                        <span style={{ color: "#e53e3e", fontWeight: "bold" }}>
                          <br />
                          ⚠️ Warning: Minimum views cannot be greater than
                          maximum views
                        </span>
                      )}
                    </small>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div
                  className={`admin-form-group ${
                    validationErrors.images ? "error" : ""
                  }`}
                >
                  <label>
                    <FaImage className="admin-form-icon" />
                    Property Images *
                  </label>
                  <div className="admin-file-upload">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      id="image-upload"
                      className="admin-file-input"
                    />
                    <label htmlFor="image-upload" className="admin-file-label">
                      <FaUpload />
                      Choose Images (Max 10 files, 10MB each)
                    </label>
                  </div>
                  {validationErrors.images && (
                    <div className="admin-validation-error">
                      <FaExclamationTriangle />
                      {validationErrors.images}
                    </div>
                  )}

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="admin-image-previews">
                      <h4>Selected Images ({imagePreviewUrls.length}):</h4>
                      <div className="admin-preview-grid">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="admin-preview-item">
                            <img src={url} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removePreviewImage(index)}
                              className="admin-remove-preview"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`admin-form-group ${
                    validationErrors.features ? "error" : ""
                  }`}
                >
                  <label>Features *</label>
                  {newListing.features.map((feature, index) => (
                    <div key={index} className="admin-array-input">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleArrayInputChange(
                            index,
                            e.target.value,
                            "features",
                            true
                          )
                        }
                        placeholder="Enter feature"
                      />
                      {newListing.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(index, "features", true)
                          }
                          className="admin-remove-btn"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("features", true)}
                    className="admin-add-btn"
                  >
                    <FaPlus /> Add Feature
                  </button>
                  {validationErrors.features && (
                    <div className="admin-validation-error">
                      <FaExclamationTriangle />
                      {validationErrors.features}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="admin-submit-btn"
                  disabled={isLoading || uploadingImages}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="admin-loading-spinner" />
                      {uploadingImages ? "Uploading Images..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Create Listing
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "edit" && editingListing && (
            <div className="admin-edit-listing">
              <div className="admin-section-header">
                <h2>Edit Listing</h2>
                <p>Update the selected property listing</p>
              </div>

              <form
                onSubmit={handleUpdateListing}
                className="admin-listing-form"
              >
                <div className="admin-form-grid">
                  <div
                    className={`admin-form-group ${
                      validationErrors.title ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaBuilding className="admin-form-icon" />
                      Property Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editingListing.title}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.title && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.title}
                      </div>
                    )}
                  </div>
                  <div className="admin-form-group">
                    <label>
                      <MdLocationCity className="admin-form-icon" />
                      Property Type *
                    </label>
                    <select
                      name="type"
                      value={editingListing.type}
                      onChange={handleInputChange}
                    >
                      <option value="Office">Office Space</option>
                      <option value="Retail">Retail Space</option>
                      <option value="Co-Working">Co-Working</option>
                    </select>
                  </div>
                  {/* UPDATED: Location Dropdown for Edit */}
                  <div
                    className={`admin-form-group ${
                      validationErrors.location ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaMapMarkerAlt className="admin-form-icon" />
                      Location *
                    </label>
                    <select
                      name="location"
                      value={editingListing.location}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Location</option>
                      {predefinedLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    {validationErrors.location && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.location}
                      </div>
                    )}
                  </div>
                  <div
                    className={`admin-form-group ${
                      validationErrors.area ? "error" : ""
                    }`}
                  >
                    <label>
                      <MdSpaceDashboard className="admin-form-icon" />
                      Area *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={editingListing.area}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.area && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.area}
                      </div>
                    )}
                  </div>
                  <div
                    className={`admin-form-group ${
                      validationErrors.price ? "error" : ""
                    }`}
                  >
                    <label>
                      <FaRupeeSign className="admin-form-icon" />
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={editingListing.price}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.price && (
                      <div className="admin-validation-error">
                        <FaExclamationTriangle />
                        {validationErrors.price}
                      </div>
                    )}
                  </div>
                  {/* ADD THIS NEW SECTION RIGHT AFTER THE PRICE FIELD: */}
                  <div className="admin-form-group">
                    <label>
                      <FaEye className="admin-form-icon" />
                      Views Range
                    </label>
                    <div className="admin-views-range">
                      <div className="admin-range-input">
                        <label>Minimum Views</label>
                        <input
                          type="number"
                          min="0"
                          max="999999"
                          value={editingListing.viewsRange[0]}
                          onChange={(e) => {
                            const minValue = parseInt(e.target.value) || 0;
                            setEditingListing((prev) => ({
                              ...prev,
                              viewsRange: [minValue, prev.viewsRange[1]],
                            }));
                          }}
                          onBlur={(e) => {
                            // Only auto-adjust on blur if min > max
                            const minValue = parseInt(e.target.value) || 0;
                            if (minValue > editingListing.viewsRange[1]) {
                              setEditingListing((prev) => ({
                                ...prev,
                                viewsRange: [minValue, minValue + 100], // Set max to min + 100
                              }));
                            }
                          }}
                          placeholder="100"
                        />
                      </div>
                      <div className="admin-range-separator">to</div>
                      <div className="admin-range-input">
                        <label>Maximum Views</label>
                        <input
                          type="number"
                          min="0"
                          max="999999"
                          value={editingListing.viewsRange[1]}
                          onChange={(e) => {
                            const maxValue = parseInt(e.target.value) || 0;
                            setEditingListing((prev) => ({
                              ...prev,
                              viewsRange: [prev.viewsRange[0], maxValue],
                            }));
                          }}
                          onBlur={(e) => {
                            // Only auto-adjust on blur if max < min
                            const maxValue = parseInt(e.target.value) || 0;
                            if (maxValue < editingListing.viewsRange[0]) {
                              setEditingListing((prev) => ({
                                ...prev,
                                viewsRange: [
                                  Math.max(0, maxValue - 100),
                                  maxValue,
                                ], // Set min to max - 100
                              }));
                            }
                          }}
                          placeholder="300"
                        />
                      </div>
                    </div>
                    <small className="admin-field-hint">
                      <FaInfoCircle /> Random views will be generated between{" "}
                      {editingListing.viewsRange[0]} and{" "}
                      {editingListing.viewsRange[1]} for this listing
                      {editingListing.viewsRange[0] >
                        editingListing.viewsRange[1] && (
                        <span style={{ color: "#e53e3e", fontWeight: "bold" }}>
                          <br />
                          ⚠️ Warning: Minimum views cannot be greater than
                          maximum views
                        </span>
                      )}
                    </small>
                  </div>
                  {/* Property Code - Read Only */}
                  <div className="admin-form-group">
                    <label>
                      <FaCode className="admin-form-icon" />
                      Property Code (Auto-generated)
                    </label>
                    <input
                      type="text"
                      value={editingListing.propertyCode}
                      disabled
                      className="admin-readonly-input"
                    />
                    <small className="admin-field-hint">
                      Property codes cannot be changed after creation
                    </small>
                  </div>
                </div>

                {/* Existing Images */}
                {editingListing.images && editingListing.images.length > 0 && (
                  <div className="admin-form-group">
                    <label>
                      <FaImage className="admin-form-icon" />
                      Current Images ({editingListing.images.length})
                    </label>
                    <div className="admin-image-previews">
                      <div className="admin-preview-grid">
                        {editingListing.images.map((url, index) => (
                          <div key={index} className="admin-preview-item">
                            <img src={url} alt={`Current ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="admin-remove-preview"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div
                  className={`admin-form-group ${
                    validationErrors.images ? "error" : ""
                  }`}
                >
                  <label>
                    <FaUpload className="admin-form-icon" />
                    Add New Images
                  </label>
                  <div className="admin-file-upload">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      id="edit-image-upload"
                      className="admin-file-input"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="admin-file-label"
                    >
                      <FaUpload />
                      Choose Additional Images
                    </label>
                  </div>
                  {validationErrors.images && (
                    <div className="admin-validation-error">
                      <FaExclamationTriangle />
                      {validationErrors.images}
                    </div>
                  )}

                  {/* New Image Previews */}
                  {editImagePreviewUrls.length > 0 && (
                    <div className="admin-image-previews">
                      <h4>
                        New Images to Add ({editImagePreviewUrls.length}):
                      </h4>
                      <div className="admin-preview-grid">
                        {editImagePreviewUrls.map((url, index) => (
                          <div key={index} className="admin-preview-item">
                            <img src={url} alt={`New Preview ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeEditPreviewImage(index)}
                              className="admin-remove-preview"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`admin-form-group ${
                    validationErrors.features ? "error" : ""
                  }`}
                >
                  <label>Features *</label>
                  {editingListing.features.map((feature, index) => (
                    <div key={index} className="admin-array-input">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleArrayInputChange(
                            index,
                            e.target.value,
                            "features"
                          )
                        }
                        placeholder="Enter feature"
                      />
                      {editingListing.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "features")}
                          className="admin-remove-btn"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("features")}
                    className="admin-add-btn"
                  >
                    <FaPlus /> Add Feature
                  </button>
                  {validationErrors.features && (
                    <div className="admin-validation-error">
                      <FaExclamationTriangle />
                      {validationErrors.features}
                    </div>
                  )}
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingListing(null);
                      setActiveTab("listings");
                      editImagePreviewUrls.forEach((url) =>
                        URL.revokeObjectURL(url)
                      );
                      setEditSelectedFiles([]);
                      setEditImagePreviewUrls([]);
                      setValidationErrors({});
                    }}
                    className="admin-cancel-btn"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-submit-btn"
                    disabled={isLoading || uploadingImages}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="admin-loading-spinner" />
                        {uploadingImages
                          ? "Uploading Images..."
                          : "Updating..."}
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Update Listing
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* New Property Code Stats Tab */}
          {activeTab === "stats" && (
            <div className="admin-stats">
              <div className="admin-section-header">
                <h2>Property Code Statistics</h2>
                <p>View auto-generated property code statistics and patterns</p>
              </div>

              {propertyCodeStats ? (
                <div className="admin-stats-content">
                  <div className="admin-stats-summary">
                    <div className="admin-stat-card">
                      <h3>Total Prefixes</h3>
                      <span className="admin-stat-number">
                        {propertyCodeStats.totalCounters}
                      </span>
                    </div>
                    <div className="admin-stat-card">
                      <h3>Total Listings</h3>
                      <span className="admin-stat-number">
                        {propertyCodeStats.totalListings}
                      </span>
                    </div>
                    <div className="admin-stat-card">
                      <h3>Available Locations</h3>
                      <span className="admin-stat-number">
                        {predefinedLocations.length}
                      </span>
                    </div>
                  </div>

                  <div className="admin-stats-table">
                    <h3>Property Code Prefixes</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Prefix</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Count</th>
                          <th>Last Updated</th>
                          <th>Next Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyCodeStats.counters.map((counter, index) => {
                          const [locationCode, typeCode] =
                            counter.prefix.split("-");
                          const locationName =
                            Object.keys(locationCodes).find(
                              (key) => locationCodes[key] === locationCode
                            ) || locationCode;
                          const typeName =
                            typeCode === "O"
                              ? "Office"
                              : typeCode === "R"
                              ? "Retail"
                              : "Co-Working";

                          return (
                            <tr key={index}>
                              <td>
                                <code>{counter.prefix}</code>
                              </td>
                              <td>{locationName}</td>
                              <td>{typeName}</td>
                              <td>{counter.count}</td>
                              <td>
                                {new Date(
                                  counter.lastUpdated
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <code>
                                  {counter.prefix}-
                                  {String(counter.count + 1).padStart(3, "0")}
                                </code>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-stats-info">
                    <h3>Property Code Format</h3>
                    <div className="admin-format-explanation">
                      <p>
                        <strong>Format:</strong>{" "}
                        <code>LOCATION-TYPE-SEQUENCE</code>
                      </p>
                      <ul>
                        <li>
                          <strong>LOCATION:</strong> 3-letter city code (BLR,
                          MUM, DEL, etc.)
                        </li>
                        <li>
                          <strong>TYPE:</strong> Property type code (O=Office,
                          R=Retail, C=Co-Working)
                        </li>
                        <li>
                          <strong>SEQUENCE:</strong> 3-digit number with leading
                          zeros (001, 002, etc.)
                        </li>
                      </ul>
                      <p>
                        <strong>Examples:</strong>
                      </p>
                      <ul>
                        <li>
                          <code>BLR-C-001</code> - First Co-Working space in
                          Bangalore
                        </li>
                        <li>
                          <code>MUM-O-042</code> - 42nd Office space in Mumbai
                        </li>
                        <li>
                          <code>DEL-R-007</code> - 7th Retail space in Delhi
                        </li>
                      </ul>

                      <h4>
                        Available Locations ({predefinedLocations.length}):
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        {predefinedLocations.map((location) => (
                          <div
                            key={location}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0.25rem",
                            }}
                          >
                            <span>{location}</span>
                            <code>{getLocationCode(location)}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="admin-loading-stats">
                  <FaSpinner className="admin-loading-spinner" />
                  <p>Loading property code statistics...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
