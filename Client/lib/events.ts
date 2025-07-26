import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

export const fetchEvents = async () => {
  const res = await axios.get(API_URL);
  return res.data.events || [];
};

export const createEvent = async (eventData) => {
  return await axios.post(API_URL, eventData);
};

export const updateEvent = async (id, eventData) => {
  return await axios.put(`${API_URL}/${id}`, eventData);
};

export const deleteEvent = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
