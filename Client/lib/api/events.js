import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Change if your backend runs on a different port

// Fetch all events
export const fetchEvents = async () => {
  const res = await axios.get(`${API_BASE}/events`);
  // Ensure we always return an array
  return res.data?.data || res.data || [];
};

// Create new event
export const createEvent = async (event) => {
  const res = await axios.post(`${API_BASE}/events`, event);
  return res.data;
};

// Update event by ID
export const updateEvent = async (id, event) => {
  const res = await axios.put(`${API_BASE}/events/${id}`, event);
  return res.data;
};

// Delete event by ID
export const deleteEvent = async (id) => {
  const res = await axios.delete(`${API_BASE}/events/${id}`);
  return res.data;
};
