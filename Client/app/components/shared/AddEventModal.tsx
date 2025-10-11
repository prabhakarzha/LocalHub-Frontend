"use client";

import { useState, useEffect } from "react";
import { ModalWrapper, InputField } from "@/ui/eventHelpers";

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
  initialData?: EventData | null; // prefill data for edit
  onSave: (
    formData: FormData,
    isEdit: boolean,
    eventId?: string
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

  const formatDateForInput = (isoDate?: string) =>
    isoDate ? isoDate.split("T")[0] : "";

  // Prefill form when editing
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
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          : "Event created successfully. Wait for Approval from admin."
      );
    } catch (error: any) {
      console.error("Error saving event:", error);
      alert(error?.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper
      onClose={() => {
        setSuccessMessage("");
        onClose();
      }}
      title={
        <span className="text-black">
          {initialData ? "Edit Event" : "Add New Event"}
        </span>
      }
    >
      {successMessage ? (
        <div className="p-4 bg-green-600 text-white rounded-lg text-center">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Title"
          />
          <InputField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
            placeholder="Date"
          />
          <InputField
            label="Location"
            value={formData.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            placeholder="Location"
          />
          <InputField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            placeholder="Price"
          />
          <input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
            className="block w-full text-gray-700"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
          >
            {saving ? "Saving..." : initialData ? "Update Event" : "Save Event"}
          </button>
        </form>
      )}
    </ModalWrapper>
  );
}
