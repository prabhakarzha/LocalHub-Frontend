import React, { memo, useMemo } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { PrimaryButton, InputField } from "./eventHelpers";

/* ----------------- Services Table Row (Memoized) ------------------ */
const ServicesTableRow = memo(
  ({ service, index, handleEdit, handleDelete }) => {
    // ✅ Memoize created by display name
    const createdByName = useMemo(
      () =>
        service.createdBy?.name ||
        (service.status === "approved" ? "Admin" : "User"),
      [service.createdBy?.name, service.status],
    );

    return (
      <tr className="border-t border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4">{service.title}</td>
        <td className="py-3 px-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {service.category}
          </span>
        </td>
        <td className="py-3 px-4">{service.contact}</td>
        <td className="py-3 px-4 font-medium">{service.price || "N/A"}</td>
        <td className="py-3 px-4">{createdByName}</td>
        <td className="py-3 px-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleEdit(service)}
              className="text-blue-500 hover:scale-110 transition"
              aria-label="Edit service"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(service._id)}
              className="text-red-500 hover:scale-110 transition"
              aria-label="Delete service"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  },
);

ServicesTableRow.displayName = "ServicesTableRow";

/* ----------------- Loading Skeleton for Table ------------------ */
const TableSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px] border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {[
            "Title",
            "Category",
            "Contact",
            "Price",
            "Created By",
            "Actions",
          ].map((header) => (
            <th key={header} className="py-3 px-4 text-left font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4].map((i) => (
          <tr key={i} className="border-t border-gray-200">
            <td className="py-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
            </td>
            <td className="py-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
            </td>
            <td className="py-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
            </td>
            <td className="py-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
            </td>
            <td className="py-3 px-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            </td>
            <td className="py-3 px-4">
              <div className="flex justify-center gap-4">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ----------------- Services Table Component (Memoized) ------------------ */
export const ServicesTable = memo(
  ({ services, loading, handleEdit, handleDelete }) => {
    // ✅ Memoize safe services array
    const safeServices = useMemo(
      () => (Array.isArray(services) ? services : []),
      [services],
    );

    // ✅ Show skeleton while loading
    if (loading) {
      return <TableSkeleton />;
    }

    return (
      <div className="overflow-x-auto">
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
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg">🔧</span>
                    <p>No services found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              safeServices.map((service, idx) => (
                <ServicesTableRow
                  key={service._id || idx}
                  service={service}
                  index={idx}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);

ServicesTable.displayName = "ServicesTable";

/* ----------------- Service Form Modal (Memoized) ------------------ */
export const ServiceForm = memo(
  ({
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

            {/* File input with proper accept attribute */}
            <div className="flex flex-col space-y-2 w-full">
              <label className="font-medium text-gray-700">Service Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
                accept="image/*"
                className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800"
              />
            </div>

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
  },
);

ServiceForm.displayName = "ServiceForm";
