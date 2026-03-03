"use client";

import { useState, useEffect } from "react";
import { ModalWrapper } from "@/ui/eventHelpers";
import { FormField } from "@/app/components/shared/FormField";

type EventData = {
  _id?: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image?: string;
};

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EventData | null;
  onSave: (
    formData: FormData,
    isEdit: boolean,
    eventId?: string,
  ) => Promise<void>;
};

export default function AddEventModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: AddEventModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    price: "",
    image: null as File | null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDateForInput = (isoDate?: string) =>
    isoDate ? isoDate.split("T")[0] : "";

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: formatDateForInput(initialData.date),
        location: initialData.location || "",
        price: initialData.price || "",
        image: null,
      });
    } else {
      setFormData({
        title: "",
        date: "",
        location: "",
        price: "",
        image: null,
      });
    }
    setErrors({});
    setSuccessMessage("");
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (parseFloat(formData.price) < 0)
      newErrors.price = "Price cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", new Date(formData.date).toISOString());
    data.append("location", formData.location);
    data.append("price", formData.price.toString());
    if (formData.image) data.append("image", formData.image);

    try {
      await onSave(data, !!initialData, initialData?._id);

      setSuccessMessage(
        initialData
          ? "Event updated successfully."
          : "Event created successfully. Wait for approval from admin.",
      );

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error saving event:", error);
      setErrors({ form: error?.message || "Failed to save event." });
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
      title={initialData ? "Edit Event" : "Add New Event"}
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
              placeholder="Enter event title"
              error={errors.title}
            />

            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              error={errors.date}
            />

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              placeholder="Enter event location"
              error={errors.location}
            />

            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              placeholder="Enter price"
              error={errors.price}
              // Remove min and step props if FormField doesn't support them
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
              {initialData?.image && !formData.image && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image: {initialData.image.split("/").pop()}
                </p>
              )}
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
                  "Update Event"
                ) : (
                  "Save Event"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
}
