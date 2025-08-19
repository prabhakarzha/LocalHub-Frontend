"use client";

import { useState } from "react";

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Yoga Class",
      date: "2025-08-01",
      location: "Community Hall",
      price: 300,
    },
    {
      id: 2,
      title: "Tech Meetup",
      date: "2025-08-05",
      location: "City Center",
      price: 0,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      title: form.title,
      date: form.date,
      location: form.location,
      price: form.price ? parseInt(form.price) : 0,
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
    setForm({
      title: "",
      description: "",
      date: "",
      location: "",
      price: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:opacity-90"
          >
            + Create Event
          </button>
        </div>

        {/* Event List Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-700">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-800">{event.title}</td>
                  <td className="p-3 text-gray-800">{event.date}</td>
                  <td className="p-3 text-gray-800">{event.location}</td>
                  <td className="p-3 text-gray-800">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-xl w-full max-w-lg shadow-2xl relative text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create New Event
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full text-gray-100"
              />
              <button
                type="submit"
                className="w-full bg-white text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-100"
              >
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
