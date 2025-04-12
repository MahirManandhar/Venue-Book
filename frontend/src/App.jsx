import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Booked from "./pages/bookedVenue";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterVenue from "./pages/RegisterVenue";
import HomePage from "./Pages/Home/HomePage";
import VenueDetails from "./pages/VenueDetails/VenueDetails";
import GuestRoute from "./GuestRoute";

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

  // const logout = () => {
  //   localStorage.removeItem("access");
  //   localStorage.removeItem("refresh");
  //   setToken(null);
  // };

  return (
    <BrowserRouter>
      <Routes>
        {/* If the user has a token, they will be redirected to "/home" from the login page */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Root route: you could redirect based on token existence */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <HomePage />}
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/venue"
          element={
            <ProtectedRoute>
              <Venue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booked"
          element={
            <ProtectedRoute>
              <Booked />
            </ProtectedRoute>
          }
        />

        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-venue" element={<RegisterVenue />} />
        <Route path="/venue-details/:venueId" element={<VenueDetails />} />

        {/* Not Found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
