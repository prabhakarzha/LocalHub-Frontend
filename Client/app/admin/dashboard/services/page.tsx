"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RootState } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getServices,
  addService,
  editService,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import { GradientHeading, PrimaryButton } from "@/ui/eventHelpers";
import { ServicesTable, ServiceForm } from "@/ui/serviceHelpers";
import { PlusCircle } from "lucide-react";

// Types
type ServiceType = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  contact: string;
  price: string;
  image?: File | null;
  userId?: string;
};

export default function ServicesPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const { services, loading } = useAppSelector(
    (state: RootState) =>
      state.services as { services: ServiceType[]; loading: boolean }
  );
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Local state
  const [formData, setFormData] = useState<ServiceType>({
    title: "",
    category: "",
    description: "",
    contact: "",
    price: "Free",
    image: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // for portal

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    setMounted(true); // portal mount check
  }, []);

  const handleCreate = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      contact: "",
      price: "Free",
      image: null,
    });
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    const service = services[index];
    if (!service) return;
    setFormData({
      title: service.title || "",
      category: service.category || "",
      description: service.description || "",
      contact: service.contact || "",
      price: service.price || "Free",
      image: null, // not reloading existing file
    });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await dispatch(removeService(id) as any);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("contact", formData.contact);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);

      if (user && user._id) {
        data.append("userId", user._id);
      }

      if (editIndex !== null) {
        const id = services[editIndex]?._id;
        if (id) await dispatch(editService({ id, serviceData: data }) as any);
      } else {
        await dispatch(addService(data) as any);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <GradientHeading text="Services" size="2xl" />
        <PrimaryButton onClick={handleCreate}>
          <PlusCircle className="w-5 h-5 mr-2 inline-block" /> Add Service
        </PrimaryButton>
      </div>

      <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden">
        <ServicesTable
          services={services}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      {/* Modal render with Portal */}
      {mounted &&
        showModal &&
        createPortal(
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSave}
            editIndex={editIndex}
            saving={saving}
            showModal={showModal}
            setShowModal={setShowModal}
          />,
          document.body
        )}
    </div>
  );
}
