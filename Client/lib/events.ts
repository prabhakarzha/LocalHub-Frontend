import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/events`;

export const fetchEvents = async () => {
  const res = await axios.get(API_URL);
  return res.data.events || [];
};

export const createEvent = async (eventData: any) => {
  return await axios.post(API_URL, eventData);
};

export const updateEvent = async (id: string, eventData: any) => {
  return await axios.put(`${API_URL}/${id}`, eventData);
};

export const deleteEvent = async (id: string) => {
  return await axios.delete(`${API_URL}/${id}`);
};
