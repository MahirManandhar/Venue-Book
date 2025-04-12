//Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Home.css";

function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/venue/");
        setVenues(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleVenueClick = (venueId) => {
    navigate(`/venue-details/${venueId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentVenues = venues.slice(0, indexOfLastItem);
  const hasMore = venues.length > indexOfLastItem;

  if (loading) return <div className="loading">Loading venues...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-container">
      <button className="my-venues-btn" onClick={() => navigate("/booked")}>
        My Bookings
      </button>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="section-title">Discover Stunning Venues</h1>

      <div className="venue-grid">
        {currentVenues.map((venue) => (
          <div
            key={venue.venueid}
            className="venue-card"
            onClick={() => handleVenueClick(venue.venueid)}
          >
            <div className="image-container">
              <img
                src={
                  venue.imageurl?.[0] || "https://via.placeholder.com/350x240"
                }
                alt={venue.venuename}
                className="venue-image"
              />
              <div className="price-badge">From Rs.{venue.starting_price}</div>
            </div>

            <div className="venue-content">
              <div className="text-container">
                <h3 className="venue-title">{venue.venuename}</h3>
                <p className="venue-address">{venue.venueaddress}</p>
              </div>
              <div className="button-container">
                <button className="book-now-btn">
                  Book Now <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          className="show-more-btn"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Show More Venues
        </button>
      )}
    </div>
  );
}

export default Home;
