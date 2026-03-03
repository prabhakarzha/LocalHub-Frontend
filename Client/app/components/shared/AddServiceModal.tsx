"use client";

import { useState, useEffect } from "react";
import { ModalWrapper } from "@/ui/eventHelpers";
import { FormField } from "@/app/components/shared/FormField";

type ServiceData = {
  _id?: string;
  title: string;
  category: "Tutor" | "Repair" | "Business";
  description: string;
  contact: string;
  price: string;
  image?: File | null;
};

type AddServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServiceData | null;
  onSave: (
    formData: FormData,
    isEdit: boolean,
    serviceId?: string,
  ) => Promise<void>;
};

export default function AddServiceModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: AddServiceModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ServiceData>({
    title: "",
    category: "Tutor",
    description: "",
    contact: "",
    price: "Free",
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Tutor",
        description: initialData.description || "",
        contact: initialData.contact || "",
        price: initialData.price || "Free",
        image: null,
      });
    } else {
      setFormData({
        title: "",
        category: "Tutor",
        description: "",
        contact: "",
        price: "Free",
        image: null,
      });
    }
    setErrors({});
    setSuccessMessage("");
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.contact.trim())
      newErrors.contact = "Contact information is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("contact", formData.contact);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      await onSave(data, !!initialData, initialData?._id);

      setSuccessMessage(
        initialData
          ? "Service updated successfully."
          : "Service created successfully. Wait for admin approval.",
      );

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error saving service:", error);
      setErrors({ form: error?.message || "Failed to save service." });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper
      onClose={handleClose}
      title={initialData ? "Edit Service" : "Add New Service"}
    >
      <div className="p-6">
        {errors.form && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errors.form}
          </div>
        )}

        {successMessage ? (
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter service title"
              error={errors.title}
            />

            {/* Category Select Field */}
            <div className="space-y-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ServiceData["category"],
                  })
                }
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tutor">Tutor</option>
                <option value="Repair">Repair</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Enter service description"
              error={errors.description}
            />

            <FormField
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              required
              placeholder="Enter contact information"
              error={errors.contact}
            />

            <FormField
              label="Price"
              name="price"
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              placeholder="Enter price (e.g., $50, Free, etc.)"
              error={errors.price}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : initialData ? (
                  "Update Service"
                ) : (
                  "Save Service"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
}
