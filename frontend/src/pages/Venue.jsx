import { useEffect, useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { 
  FaArrowRight, 
  FaTimes, 
  FaCalendarAlt, 
  FaPlusCircle, 
  FaUsers, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Venue.css";

function VenuesList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const navigate = useNavigate();

  let venueownerid = null;
  if (token) {
    const decoded = jwtDecode(token);
    venueownerid = decoded.user_id;
  }

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get(
          `http://localhost:8000/api/venues/owner/${venueownerid}/`
        );
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [venueownerid]);

  const openVenueDetails = (venue) => {
    setSelectedVenue(venue);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVenue(null);
    document.body.style.overflow = "auto";
  };

  // Navigate to register venue page
  const handleRegisterVenue = () => {
    navigate('/register-venue');
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("venue-detail-overlay")) {
      closeModal();
    }
  };
  
  // Count bookings for a venue
  const getBookingsCount = (venue) => {
    return venue.booked_dates ? venue.booked_dates.length : 0;
  };

  // Handle booking status update
  const handleBookingStatus = (bookingId, status) => {
    // This would be an API call to update booking status
    console.log(`Booking ${bookingId} status updated to: ${status}`);
    // After API call, you would update the local state
    
    // Example implementation:
    if (selectedVenue) {
      const updatedVenue = {...selectedVenue};
      const updatedBookings = updatedVenue.booked_dates.map(booking => {
        if (booking.id === bookingId) {
          return {...booking, status};
        }
        return booking;
      });
      updatedVenue.booked_dates = updatedBookings;
      setSelectedVenue(updatedVenue);
      
      // Also update in the main venues list
      const updatedVenues = venues.map(venue => {
        if (venue.venueid === selectedVenue.venueid) {
          return updatedVenue;
        }
        return venue;
      });
      setVenues(updatedVenues);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  if (loading) return <div className="loading">Loading your venues...</div>;

  return (
    <div className="venue-container">
      <h1 className="section-title">Your Venue Portfolio</h1>
      
      {/* Register Venue Button */}
      <button className="register-venue-btn" onClick={handleRegisterVenue}>
        <FaPlusCircle /> Register New Venue
      </button>
      
      {venues.length > 0 ? (
        <div className="venue-grid">
          {venues.map((venue) => (
            <div
              key={venue.venueid}
              className="venue-card"
              onClick={() => openVenueDetails(venue)}
            >
              <div className="venue-card-content">
                <div className="image-container">
                  <img
                    src={venue.imageurl?.[0] || "https://via.placeholder.com/350x240"}
                    alt={venue.venuename}
                    className="venue-image"
                  />
                  <div className="venue-labels">
                    <span className="venue-price-range">Rs.{venue.min_price} - {venue.max_price}</span>
                    <span className="venue-location"><FaMapMarkerAlt /> {venue.venueaddress || "Not specified"}</span>
                  </div>
                  <div className="venue-badge">
                    <span className="booking-count">
                      <FaUsers /> {getBookingsCount(venue)} {getBookingsCount(venue) === 1 ? 'Booking' : 'Bookings'}
                    </span>
                  </div>
                </div>
                <div className="venue-info">
                  <h3 className="venue-title">{venue.venuename}</h3>
                  <div className="venue-details">
                    <p className="venue-capacity">Capacity: {venue.max_capacity}</p>
                    <p className="venue-status">
                      Status: <span className={getBookingsCount(venue) > 0 ? "has-bookings" : "no-bookings"}>
                        {getBookingsCount(venue) > 0 ? 'Active' : 'Available'}
                      </span>
                    </p>
                  </div>
                  <button className="view-details-btn">
                    View Details <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-venues">
          <h3>No Venues Listed Yet</h3>
          <p>You haven't registered any venues. Get started by registering your first venue.</p>
          <button className="register-first-venue-btn" onClick={handleRegisterVenue}>
            <FaPlusCircle /> Register Your First Venue
          </button>
        </div>
      )}

      {/* Venue Details Modal */}
      {showModal && selectedVenue && (
        <div 
          className={`venue-detail-overlay ${showModal ? 'active' : ''}`}
          onClick={handleOverlayClick}
        >
          <div className="venue-detail-modal">
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-header">
              <img
                src={selectedVenue.imageurl?.[0] || "https://via.placeholder.com/800x400"}
                alt={selectedVenue.venuename}
                className="modal-image"
              />
              <div className="modal-title-container">
                <h2 className="modal-title">{selectedVenue.venuename}</h2>
                <p className="modal-subtitle">
                  <FaMapMarkerAlt /> {selectedVenue.venueaddress || "Address not specified"}
                </p>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="venue-specs">
                <div className="spec-item">
                  <span className="spec-label">Capacity</span>
                  <span className="spec-value">{selectedVenue.max_capacity} people</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Price Range</span>
                  <span className="spec-value">Rs.{selectedVenue.min_price} - Rs.{selectedVenue.max_price}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Bookings</span>
                  <span className={`spec-value ${getBookingsCount(selectedVenue) > 0 ? "has-bookings" : "no-bookings"}`}>
                    {getBookingsCount(selectedVenue)}
                  </span>
                </div>
              </div>
              
              <div className="venue-description">
                <h4>About This Venue</h4>
                <p>{selectedVenue.description || "No description available for this venue."}</p>
              </div>
              
              <div className="booking-section">
                <h4>Current Bookings</h4>
                
                {selectedVenue.booked_dates && selectedVenue.booked_dates.length > 0 ? (
                  <ul className="booking-list">
                    {selectedVenue.booked_dates.map((booking, index) => (
                      <li key={index} className={`booking-item ${booking.status ? booking.status : ''}`}>
                        <div className="booking-details">
                          <div className="booking-user">
                            <span className="user-name">{booking.user.username}</span>
                            <span className="user-email">{booking.user.email}</span>
                          </div>
                          <div className="booking-date">
                            <FaCalendarAlt />
                            <span>{booking.start_date} to {booking.end_date}</span>
                          </div>
                          <div className="booking-contact">
                            <span className="contact-label">Contact:</span>
                            <span className="contact-number">{booking.user.phone || "Not provided"}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <button 
                            className="accept-booking" 
                            onClick={() => handleBookingStatus(booking.id, 'accepted')}
                            disabled={booking.status === 'accepted'}
                          >
                            <FaCheckCircle /> {booking.status === 'accepted' ? 'Accepted' : 'Accept'}
                          </button>
                          <button 
                            className="reject-booking" 
                            onClick={() => handleBookingStatus(booking.id, 'rejected')}
                            disabled={booking.status === 'rejected'}
                          >
                            <FaTimesCircle /> {booking.status === 'rejected' ? 'Rejected' : 'Reject'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-bookings-info">
                    <p>No bookings yet for this venue</p>
                    <span>Your venue is ready to be booked!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenuesList;