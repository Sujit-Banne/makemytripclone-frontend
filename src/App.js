import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Visa from './pages/Visa';
import Flights from './pages/Flights';
import International from './pages/International';
import Domestic from './pages/Domestic';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminHotels from './pages/AdminHotels';
import AdminFlights from './pages/AdminFlights';
import AdminVisas from './pages/AdminVisas';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminHotelBookings from './pages/AdminHotelBookings';
import AdminFlightBookings from './pages/AdminFlightBookings';
import AdminVisaApplications from './pages/AdminVisaApplications';
import NotFound from './pages/NotFound';
import Chatbot from './components/Chatbot';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/international" element={<International />} />
          <Route path="/domestic" element={<Domestic />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="/admin/flights" element={<AdminFlights />} />
          <Route path="/admin/visas" element={<AdminVisas />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/hotel-bookings" element={<AdminHotelBookings />} />
          <Route path="/admin/flight-bookings" element={<AdminFlightBookings />} />
          <Route path="/admin/visa-applications" element={<AdminVisaApplications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Chatbot />
    </Router>
  );
}

export default App;
