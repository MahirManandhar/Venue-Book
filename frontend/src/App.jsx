import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterVenue from "./pages/RegisterVenue";
import HomePage from "./Pages/Home/HomePage";
import VenueDetails from "./pages/VenueDetails/VenueDetails";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from "/" to "/home" */}
        {/* Set HomePage as the initial page */}

        {/* Home route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Venue route */}
        <Route
          path="/venue"
          element={
            <ProtectedRoute>
              <Venue />
            </ProtectedRoute>
          }
        />

        {/* Login route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Logout route */}
        <Route path="/logout" element={<Logout />} />

        {/* Register route */}
        <Route path="/register" element={<Register />} />

        {/* RegisterVenue route */}
        <Route path="/register-venue" element={<RegisterVenue />} />

        <Route path="/venue-details/:venueId" element={<VenueDetails />} />

        {/* Not Found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
