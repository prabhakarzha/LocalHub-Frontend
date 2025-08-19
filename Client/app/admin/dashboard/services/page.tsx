"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getServices, addService } from "@/src/redux/slices/servicesSlice";

export default function ServicesPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const { services, loading } = useAppSelector(
    (state: RootState) =>
      state.services as { services: ServiceType[]; loading: boolean }
  );

  const user = useAppSelector((state: RootState) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    contact: "",
    price: "",
    image: null as File | null,
  });

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("contact", form.contact);
    data.append("price", form.price);
    if (form.image) {
      data.append("image", form.image);
    }

    // ✅ Add userId if available
    if (user && user._id) {
      data.append("userId", user._id);
    }

    await dispatch(addService(data) as any);
    setIsModalOpen(false);

    setForm({
      title: "",
      category: "",
      description: "",
      contact: "",
      price: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:opacity-90"
          >
            + Add Service
          </button>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-700">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Loading services...
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-gray-800">{service.title}</td>
                    <td className="p-3 text-gray-800">{service.category}</td>
                    <td className="p-3 text-gray-800">{service.contact}</td>
                    <td className="p-3 text-gray-800">{service.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding Service */}
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
              Add New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Service Title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              >
                <option value="">Select Category</option>
                <option value="Tutor">Tutor</option>
                <option value="Repair">Repair</option>
                <option value="Business">Business</option>
              </select>
              <textarea
                name="description"
                placeholder="Service Description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Info"
                value={form.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-gray-800"
                required
              />
              <input
                type="text"
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
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Types
type ServiceType = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  contact: string;
  price: string;
  image?: string;
  userId?: string;
};
