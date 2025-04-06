import React, { useState, useEffect } from "react";
import "../styles/RegisterVenue.css";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaList,
  FaFileAlt,
  FaImage,
  FaCheckCircle,
  FaDollarSign,
  FaUserFriends,
  FaMusic,
} from "react-icons/fa";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

const RegisterVenue = () => {
  const [formData, setFormData] = useState({
    venuename: "",
    venueaddress: "",
    features: "",
    description: "",
    imageurl: "",
    capacity: "",
    minPrice: "",
    maxPrice: "",
  });

  const [errors, setErrors] = useState({});
  const [formStage, setFormStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const token = localStorage.getItem(ACCESS_TOKEN);
  let venueownerid = null;

  if (token) {
    const decoded = jwtDecode(token);
    venueownerid = decoded.user_id; // or decoded.id based on your token structure
  }

  const validateStage = (stage) => {
    let validationErrors = {};

    if (stage === 1) {
      if (!formData.venuename)
        validationErrors.venuename = "Venue name is required";
      if (!formData.venueaddress)
        validationErrors.venueaddress = "Venue address is required";
    } else if (stage === 2) {
      if (!formData.features)
        validationErrors.features = "Features are required";
      if (!formData.capacity)
        validationErrors.capacity = "Capacity is required";
      if (!formData.minPrice || !formData.maxPrice) {
        validationErrors.price = "Price range (min and max) is required";
      }
      if (parseInt(formData.minPrice) > parseInt(formData.maxPrice)) {
        validationErrors.price =
          "Min price should not be higher than Max price";
      }
    } else if (stage === 3) {
      if (!formData.description)
        validationErrors.description = "Description is required";

      const imageUrls = formData.imageurl
        .split("\n")
        .filter((url) => url.trim() !== "");
      if (imageUrls.length === 0)
        validationErrors.imageurl = "At least one image URL is required";
    }

    return validationErrors;
  };

  const nextStage = () => {
    const validationErrors = validateStage(formStage);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setFormStage(formStage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStage = () => {
    setFormStage(formStage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateStage(3);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      // Format the price range (min_price and max_price) from the user input
      const imageUrls = formData.imageurl
        .split("\n")
        .filter((url) => url.trim() !== "");

      // Prepare the data to send to the backend
      const submissionData = {
        venuename: formData.venuename,
        venueaddress: formData.venueaddress,
        features: formData.features,
        description: formData.description,
        imageurl: imageUrls,
        min_price: parseFloat(formData.minPrice), // Corrected to decimal
        max_price: parseFloat(formData.maxPrice),
        max_capacity: parseInt(formData.capacity), // Corrected to integer
        venueownerid: venueownerid,
      };

      try {
        const response = await axios.post(
          `http://localhost:8000/api/venueRegister/`,
          submissionData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              // If you have authorization, add your token here
            },
          }
        );
        console.log("Venue registered:", response.data);
        setIsSubmitting(false);
        setSubmitted(true);

        setFormData({
          venuename: "",
          venueaddress: "",
          features: "",
          description: "",
          imageurl: "",
          capacity: "",
          minPrice: "",
          maxPrice: "",
        });
      } catch (error) {
        console.error("Error submitting venue:", error);
        if (error.response) {
          console.error("Backend error details:", error.response.data);
        }
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="register-venue-container">
      <div className="register-venue-box">
        <div className="form-progress">
          <div
            className={`progress-step ${formStage >= 1 ? "active" : ""} ${
              formStage > 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-line"></div>
          <div
            className={`progress-step ${formStage >= 2 ? "active" : ""} ${
              formStage > 2 ? "completed" : ""
            }`}
          >
            <div className="step-number">2</div>
            <div className="step-label">Features</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${formStage >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Media</div>
          </div>
        </div>

        <h2>List Your Venue</h2>
        <p className="form-subtitle">
          {formStage === 1 &&
            "Start showcasing your venue to thousands of potential clients"}
          {formStage === 2 && "Tell us what makes your venue special"}
          {formStage === 3 && "Upload images to make your venue stand out"}
        </p>

        <form onSubmit={handleSubmit}>
          {formStage === 1 && (
            <div className="form-stage">
              {/* Venue Name Field */}
              <div className="form-field-row">
                <div className="form-field-label">Venue Name</div>
                <div className="form-field-input">
                  <div className="input-with-icon">
                    <FaBuilding className="icon" />
                    <input
                      type="text"
                      id="venuename"
                      name="venuename"
                      placeholder="E.g., Party Palace"
                      value={formData.venuename}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.venuename && (
                    <span className="error">{errors.venuename}</span>
                  )}
                </div>
              </div>

              {/* Venue Category Field */}

              {/* Venue Address Field */}
              <div className="form-field-row">
                <div className="form-field-label">Venue Address</div>
                <div className="form-field-input">
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="icon" />
                    <input
                      type="text"
                      id="venueaddress"
                      name="venueaddress"
                      placeholder="E.g., Kathmandu"
                      value={formData.venueaddress}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.venueaddress && (
                    <span className="error">{errors.venueaddress}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {formStage === 2 && (
            <div className="form-stage">
              {/* Capacity Field */}
              <div className="form-field-row">
                <div className="form-field-label">Capacity</div>
                <div className="form-field-input">
                  <div className="input-with-icon">
                    <FaUserFriends className="icon" />
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      placeholder="Maximum number of guests"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.capacity && (
                    <span className="error">{errors.capacity}</span>
                  )}
                </div>
              </div>

              {/* Price Range Field */}
              <div className="form-field-row">
                <div className="form-field-label">Price Range</div>
                <div className="form-field-input">
                  <div className="input-with-icon">
                    <FaDollarSign className="icon" />
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      placeholder="E.g., $1000 per day"
                      value={formData.minPrice}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.minPrice && (
                    <span className="error">{errors.minPrice}</span>
                  )}
                </div>
              </div>
              <div className="form-field-row">
                <div className="form-field-label">Price Range</div>
                <div className="form-field-input">
                  <div className="input-with-icon">
                    <FaDollarSign className="icon" />
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      placeholder="E.g., $5000 per day"
                      value={formData.maxPrice}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.maxPrice && (
                    <span className="error">{errors.maxPrice}</span>
                  )}
                </div>
              </div>

              {/* Features Field */}
              <div className="form-field-row">
                <div className="form-field-label">Features & Amenities</div>
                <div className="form-field-input">
                  <div className="input-with-icon textarea-wrapper">
                    <FaList className="icon" />
                    <textarea
                      id="features"
                      name="features"
                      placeholder="List all features (e.g., Parking, WiFi, Sound System, Catering Services)"
                      value={formData.features}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  {errors.features && (
                    <span className="error">{errors.features}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {formStage === 3 && (
            <div className="form-stage">
              {/* Description Field */}
              <div className="form-field-row">
                <div className="form-field-label">Venue Description</div>
                <div className="form-field-input">
                  <div className="input-with-icon textarea-wrapper">
                    <FaFileAlt className="icon" />
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe your venue in detail. What makes it special and perfect for events?"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                    />
                  </div>
                  {errors.description && (
                    <span className="error">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* Image URLs Field */}
              <div className="form-field-row">
                <div className="form-field-label">Image URLs</div>
                <div className="form-field-input">
                  <div className="input-with-icon textarea-wrapper">
                    <FaImage className="icon" />
                    <textarea
                      id="imageurl"
                      name="imageurl"
                      placeholder="Enter image URLs (one per line)"
                      value={formData.imageurl}
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  {errors.imageurl && (
                    <span className="error">{errors.imageurl}</span>
                  )}
                  <div className="help-text">
                    High-quality images increase the likelihood of bookings.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-navigation">
            {formStage > 1 && (
              <button type="button" className="back-btn" onClick={prevStage}>
                Back
              </button>
            )}

            {formStage < 3 ? (
              <button type="button" className="next-btn" onClick={nextStage}>
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className={`register-btn ${isSubmitting ? "submitting" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register Venue"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterVenue;
