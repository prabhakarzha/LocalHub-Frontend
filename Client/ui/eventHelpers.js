import React from "react";
import { Edit, Trash2 } from "lucide-react";
import ReactDOM from "react-dom";

/* ----------------- Gradient Heading ------------------ */
export const GradientHeading = ({ text, size = "3xl" }) => (
  <h2
    className={`bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-${size}`}
  >
    {text}
  </h2>
);

/* ----------------- Primary Button ------------------ */
export const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md flex items-center gap-2 transition ${
      disabled ? "opacity-60 cursor-not-allowed" : ""
    }`}
  >
    {children}
  </button>
);

/* ----------------- Input Field ------------------ */
export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-gray-800 placeholder-gray-400"
    />
  </div>
);

/* ----------------- Select Field ------------------ */
export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="flex flex-col space-y-2 w-full">
    <label className="font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-gray-800"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* ----------------- Modal Wrapper ------------------ */
export const ModalWrapper = ({ onClose, title, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-semibold mb-6 text-center">{title}</h3>
        {children}
      </div>
    </div>,
    document.body
  );
};

/* ----------------- Stat Card ------------------ */
export const StatCard = ({ stat }) => (
  <div
    className={`p-4 sm:p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${stat.gradient} flex flex-col items-center`}
  >
    {stat.icon}
    <p className="mt-2 text-base sm:text-lg text-center">{stat.title}</p>
    <h3 className="text-xl sm:text-2xl font-bold">{stat.value}</h3>
  </div>
);

/* ----------------- Events Table ------------------ */
export const EventsTable = ({ events, loading, handleEdit, handleDelete }) => {
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center text-gray-600 py-4">Loading events...</p>
      ) : (
        <table className="w-full min-w-[600px] border-collapse text-gray-700">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Location</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
              <th className="py-3 px-4 text-left font-semibold">Created By</th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              safeEvents.map((event, idx) => (
                <tr
                  key={event._id || idx}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">{event.date}</td>
                  <td className="py-3 px-4">{event.location}</td>
                  <td className="py-3 px-4">{event.price || "Free"}</td>
                  <td className="py-3 px-4">
                    {event.createdBy?.name ||
                      (event.status === "approved" ? "Admin" : "User")}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:scale-110 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-red-500 hover:scale-110 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ----------------- Event Form ------------------ */
export const EventForm = ({
  formData,
  setFormData,
  onSubmit,
  editIndex,
  PrimaryButton,
  InputField,
  saving,
}) => (
  <form onSubmit={onSubmit} className="flex flex-col space-y-5 w-full">
    <InputField
      label="Event Title"
      type="text"
      value={formData.title}
      placeholder="e.g. Yoga Class"
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      required
    />
    <InputField
      label="Event Date"
      type="date"
      value={formData.date}
      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      required
    />
    <InputField
      label="Location"
      type="text"
      value={formData.location}
      placeholder="e.g. Community Center"
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      required
    />
    <InputField
      label="Price (Optional)"
      type="text"
      value={formData.price}
      placeholder="₹500 / Free"
      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
    />

    {/* File input */}
    <div className="flex flex-col space-y-2 w-full">
      <label className="font-medium text-gray-700">Event Image</label>
      <input
        type="file"
        onChange={(e) =>
          setFormData({ ...formData, image: e.target.files?.[0] || null })
        }
        className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800"
      />
    </div>

    <div className="flex justify-end">
      <PrimaryButton type="submit" disabled={saving}>
        {saving
          ? "Saving..."
          : editIndex !== null
          ? "Update Event"
          : "Save Event"}
      </PrimaryButton>
    </div>
  </form>
);
