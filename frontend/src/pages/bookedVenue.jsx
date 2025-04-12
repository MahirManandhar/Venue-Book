import { useEffect, useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaInfo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import "../styles/UserBookings.css";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem(ACCESS_TOKEN);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        console.log(decoded);
        // Get all bookings
        const response = await api.get(
          `http://localhost:8000/api/userbookings/${userId}/`
        );

        // Filter bookings for current user
        const userBookings = response.data.filter(
          (booking) => booking.user === userId
        );

        // For each booking, fetch venue details
        const bookingsWithVenueDetails = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const venueResponse = await api.get(
                `http://localhost:8000/api/venues/id/${booking.venue}/`
              );
              return {
                ...booking,
                venueDetails: venueResponse.data,
              };
            } catch (error) {
              console.error(`Error fetching venue ${booking.venue}:`, error);
              return {
                ...booking,
                venueDetails: {
                  venuename: "Unknown Venue",
                  venueaddress: "Address unavailable",
                },
              };
            }
          })
        );

        setBookings(bookingsWithVenueDetails);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [token]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;

  if (!token) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view your bookings.</p>
        <button onClick={() => navigate("/login")} className="auth-btn">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="user-bookings-container">
      <h1 className="section-title">My Bookings</h1>

      {bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`booking-item ${
                booking.verified ? "verified" : "pending"
              }`}
            >
              <div className="booking-header">
                <div className="venue-info">
                  <h3>{booking.venueDetails?.venuename || "Unknown Venue"}</h3>
                  <p className="venue-address">
                    <FaMapMarkerAlt />
                    {booking.venueDetails?.venueaddress ||
                      "Address not available"}
                  </p>
                </div>
                <div className="booking-status">
                  {booking.verified ? (
                    <span className="status-badge confirmed">
                      <FaCheckCircle /> Confirmed
                    </span>
                  ) : (
                    <span className="status-badge pending">
                      <FaInfo /> Pending Approval
                    </span>
                  )}
                </div>
              </div>

              <div className="booking-details">
                <div className="date-info">
                  <FaCalendarAlt className="calendar-icon" />
                  <div>
                    <div className="date-range">
                      <span className="date-label">From:</span>
                      <span className="date-value">
                        {formatDate(booking.start_date)}
                      </span>
                    </div>
                    <div className="date-range">
                      <span className="date-label">To:</span>
                      <span className="date-value">
                        {formatDate(booking.end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.venueDetails && (
                  <div className="venue-details">
                    <div className="detail-item">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">
                        {booking.venueDetails.max_capacity || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price Range:</span>
                      <span className="detail-value">
                        Rs.{booking.venueDetails.min_price || "N/A"} - Rs.
                        {booking.venueDetails.max_price || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                <button
                  className="cancel-booking-btn"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this booking?"
                      )
                    ) {
                      api
                        .delete(
                          `http://localhost:8000/api/bookings/${booking.id}/`
                        )
                        .then(() => {
                          setBookings(
                            bookings.filter((b) => b.id !== booking.id)
                          );
                        })
                        .catch((error) => {
                          console.error("Error canceling booking:", error);
                          alert("Failed to cancel booking");
                        });
                    }
                  }}
                >
                  <FaTimesCircle /> Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <h3>No Bookings Found</h3>
          <p>You haven't booked any venues yet.</p>
          <button
            className="explore-venues-btn"
            onClick={() => navigate("/venues")}
          >
            Explore Venues
          </button>
        </div>
      )}
    </div>
  );
}

export default UserBookings;
