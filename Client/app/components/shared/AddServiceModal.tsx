"use client";

import { useState, useEffect } from "react";
import { ModalWrapper, InputField, SelectField } from "@/ui/eventHelpers";

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
    serviceId?: string
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
    setSuccessMessage("");
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          : "Service created successfully. Wait for admin approval."
      );
    } catch (error: any) {
      console.error("Error saving service:", error);
      alert(error?.message || "Failed to save service.");
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
          {initialData ? "Edit Service" : "Add New Service"}
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
            placeholder="Service Title"
          />

          <SelectField
            label="Category"
            value={formData.category}
            options={["Tutor", "Repair", "Business"]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({
                ...formData,
                category: e.target.value as ServiceData["category"],
              })
            }
            required
          />

          <InputField
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Description"
          />

          <InputField
            label="Contact"
            value={formData.contact}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            required
            placeholder="Contact Info"
          />

          <InputField
            label="Price"
            type="text"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Price (default Free)"
            required
          />

          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
            className="block w-full text-gray-700"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
          >
            {saving
              ? "Saving..."
              : initialData
              ? "Update Service"
              : "Save Service"}
          </button>
        </form>
      )}
    </ModalWrapper>
  );
}
