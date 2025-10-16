import React from "react";
import { Edit, Trash2, X } from "lucide-react";
import { PrimaryButton, InputField } from "./eventHelpers";

/* ----------------- Services Table Component ------------------ */
export const ServicesTable = ({
  services,
  loading,
  handleEdit,
  handleDelete,
}) => {
  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center text-gray-600 py-4">Loading services...</p>
      ) : (
        <table className="w-full min-w-[600px] border-collapse text-gray-700">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Category</th>
              <th className="py-3 px-4 text-left font-semibold">Contact</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
              <th className="py-3 px-4 text-left font-semibold">Created By</th>

              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeServices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No services found.
                </td>
              </tr>
            ) : (
              safeServices.map((service, idx) => (
                <tr
                  key={service._id || idx}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{service.title}</td>
                  <td className="py-3 px-4">{service.category}</td>
                  <td className="py-3 px-4">{service.contact}</td>
                  <td className="py-3 px-4">{service.price || "N/A"}</td>
                  <td className="py-3 px-4">
                    {service.createdBy?.name ||
                      (service.status === "approved" ? "Admin" : "User")}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-500 hover:scale-110 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
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

/* ----------------- Service Form Component with Modal ------------------ */
export const ServiceForm = ({
  formData,
  setFormData,
  onSubmit,
  editIndex,
  saving,
  showModal,
  setShowModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Black Background + Blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 z-10">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {editIndex !== null ? "Edit Service" : "Add New Service"}
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col space-y-5">
          <InputField
            label="Service Title"
            type="text"
            value={formData.title}
            placeholder="e.g. Electrician or Tutor"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          {/* Category Field */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-gray-800"
              required
            >
              <option value="">Select a category</option>
              <option value="Tutor">Tutor</option>
              <option value="Repair">Repair</option>
              <option value="Business">Business</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Beauty">Beauty & Wellness</option>
              <option value="Other">Other Services</option>
            </select>
          </div>

          <InputField
            label="Description"
            type="text"
            value={formData.description}
            placeholder="Brief description of service"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <InputField
            label="Contact Info"
            type="text"
            value={formData.contact}
            placeholder="Phone or Email"
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            required
          />
          <InputField
            label="Price/Rate"
            type="text"
            value={formData.price}
            placeholder="₹500/hour or per visit"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <InputField
            label="Service Image"
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
          />

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editIndex !== null
                ? "Update Service"
                : "Save Service"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
