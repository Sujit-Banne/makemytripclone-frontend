import axios from 'axios';

const API_BASE_URL = 'https://bountiful-grace-production-a4a7.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getPosts = () => api.get('/posts');
export const getUserPosts = () => api.get('/posts/user/posts');
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const getHotels = (params) => api.get('/hotels', { params });
export const getFlights = (params) => api.get('/flights', { params });
export const getVisas = (params) => api.get('/visas', { params });

// Admin CRUD
export const createHotel = (data) => api.post('/admin/hotels', data);
export const updateHotel = (id, data) => api.put(`/admin/hotels/${id}`, data);
export const deleteHotel = (id) => api.delete(`/admin/hotels/${id}`);

export const createFlight = (data) => api.post('/admin/flights', data);
export const updateFlight = (id, data) => api.put(`/admin/flights/${id}`, data);
export const deleteFlight = (id) => api.delete(`/admin/flights/${id}`);

export const createVisa = (data) => api.post('/admin/visas', data);
export const updateVisa = (id, data) => api.put(`/admin/visas/${id}`, data);
export const deleteVisa = (id) => api.delete(`/admin/visas/${id}`);

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const updateAdminUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);

// Booking functions
export const bookHotel = (data) => api.post('/hotel-bookings/book', data);
export const getUserHotelBookings = () => api.get('/hotel-bookings/my-bookings');
export const cancelHotelBooking = (id) => api.put(`/hotel-bookings/${id}/cancel`);

export const bookFlight = (data) => api.post('/flight-bookings/book', data);
export const getUserFlightBookings = () => api.get('/flight-bookings/my-bookings');
export const cancelFlightBooking = (id) => api.put(`/flight-bookings/${id}/cancel`);

export const applyForVisa = (data) => api.post('/visa-applications/apply', data);
export const getUserVisaApplications = () => api.get('/visa-applications/my-applications');

// Admin booking management
export const getAdminHotelBookings = (params) => api.get('/admin/hotel-bookings', { params });
export const updateHotelBookingStatus = (id, data) => api.put(`/admin/hotel-bookings/${id}`, data);

export const getAdminFlightBookings = (params) => api.get('/admin/flight-bookings', { params });
export const updateFlightBookingStatus = (id, data) => api.put(`/admin/flight-bookings/${id}`, data);

export const getAdminVisaApplications = (params) => api.get('/admin/visa-applications', { params });
export const updateVisaApplicationStatus = (id, data) => api.put(`/admin/visa-applications/${id}`, data);

export default api;
