"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/src/redux/store";
import withAdminAuth from "@/app/components/withAdminAuth";

import {
  Calendar,
  DollarSign,
  LayoutDashboard,
  PlusCircle,
  Wrench,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import axios from "axios";
import {
  getEvents,
  editEvent,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";
import {
  getServices,
  editService,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import {
  GradientHeading,
  PrimaryButton,
  InputField,
  ModalWrapper,
  StatCard,
  EventsTable,
} from "@/ui/eventHelpers";
import { ServicesTable, ServiceForm } from "@/ui/serviceHelpers";
import Navbar from "@/app/components/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type EventType = {
  _id?: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
};

function AdminDashboardPage() {
  const dispatch = useAppDispatch();

  const { events, loading } = useAppSelector(
    (state: RootState) =>
      state.events as { events: EventType[]; loading: boolean }
  );

  const { services, loading: serviceLoading } = useAppSelector(
    (state: RootState) => state.services
  );

  const [activeTab, setActiveTab] = useState<"events" | "services">("events");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    price: "",
    image: null as File | null,
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editServiceIndex, setEditServiceIndex] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    category: "",
    description: "",
    contact: "",
    price: "Free",
    image: null as File | null,
  });
  const [savingService, setSavingService] = useState(false);

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getServices());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: <Calendar className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Total Services",
      value: services.length,
      icon: <Wrench className="w-6 h-6 text-white" />,
      gradient: "from-green-400 to-green-600",
    },
    {
      title: "Total Bookings",
      value: 85,
      icon: <LayoutDashboard className="w-6 h-6 text-white" />,
      gradient: "from-pink-400 to-red-500",
    },
    {
      title: "Revenue",
      value: "$5,200",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  // --- Handlers (unchanged) ---
  const handleCreate = () => {
    setFormData({ title: "", date: "", location: "", price: "", image: null });
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    const selectedEvent = events[index];
    if (!selectedEvent) return;
    setFormData({
      title: selectedEvent.title ?? "",
      date: selectedEvent.date ?? "",
      location: selectedEvent.location ?? "",
      price: selectedEvent.price ?? "",
      image: null,
    });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventId = events[index]?._id;
      if (eventId) dispatch(removeEvent(eventId));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);

      if (editIndex !== null) {
        const id = events[editIndex]?._id;
        if (id) await dispatch(editEvent({ id, eventData: data }) as any);
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(getEvents());
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    setServiceForm({
      title: "",
      category: "",
      description: "",
      contact: "",
      price: "Free",
      image: null,
    });
    setEditServiceIndex(null);
    setShowServiceModal(true);
  };

  const handleEditService = (index: number) => {
    const selected = services[index];
    if (!selected) return;
    setServiceForm({
      title: selected.title || "",
      category: selected.category || "",
      description: selected.description || "",
      contact: selected.contact || "",
      price: selected.price || "Free",
      image: null,
    });
    setEditServiceIndex(index);
    setShowServiceModal(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      dispatch(removeService(id));
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(true);
    try {
      const data = new FormData();
      data.append("title", serviceForm.title);
      data.append("category", serviceForm.category);
      data.append("description", serviceForm.description);
      data.append("contact", serviceForm.contact);
      data.append("price", serviceForm.price);
      if (serviceForm.image) data.append("image", serviceForm.image);

      if (editServiceIndex !== null) {
        const id = services[editServiceIndex]?._id;
        if (id) await dispatch(editService({ id, serviceData: data }) as any);
      } else {
        await axios.post(`${API_BASE_URL}/api/services`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(getServices());
      }
      setShowServiceModal(false);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSavingService(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-1200 via-purple-1200 to-slate-1200 overflow-hidden relative">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <nav className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow p-4 flex justify-between items-center">
        <Navbar />
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20">
        {/* Sticky heading */}
        <div className="sticky top-20 z-20 flex justify-center">
          <GradientHeading text="Admin Dashboard" size="4xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-4 border-b border-white/30">
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === "events"
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
            }`}
          >
            Manage Events
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === "services"
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
            }`}
          >
            Manage Services
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <GradientHeading text="Events" size="2xl" />
              <PrimaryButton onClick={handleCreate} disabled={false}>
                {" "}
                <PlusCircle className="w-5 h-5 mr-2 inline-block" /> Create
                Event{" "}
              </PrimaryButton>
            </div>
            <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden">
              <EventsTable
                events={events}
                loading={loading}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
              <GradientHeading text="Services" size="2xl" />
              <PrimaryButton onClick={handleAddService} disabled={false}>
                {" "}
                <PlusCircle className="w-5 h-5 mr-2 inline-block" /> Add Service{" "}
              </PrimaryButton>
            </div>
            <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden">
              <ServicesTable
                services={services}
                loading={serviceLoading}
                handleEdit={handleEditService}
                handleDelete={(id: string) => id && handleDeleteService(id)}
              />
            </div>
          </div>
        )}

        {/* Event Modal */}
        {showModal && (
          <ModalWrapper
            onClose={() => setShowModal(false)}
            title={editIndex !== null ? "Edit Event" : "Create New Event"}
          >
            <form onSubmit={handleSave} className="space-y-4">
              <InputField
                label="Title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title"
                required
              />
              <InputField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="Enter location"
                required
              />
              <InputField
                label="Location"
                value={formData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
                required
              />
              <InputField
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Enter price"
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="block w-full text-gray-700"
              />
              <PrimaryButton onClick={() => {}} type="submit" disabled={saving}>
                {" "}
                {saving ? "Saving..." : "Save Event"}{" "}
              </PrimaryButton>
            </form>
          </ModalWrapper>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <ModalWrapper
            onClose={() => setShowServiceModal(false)}
            title={
              editServiceIndex !== null ? "Edit Service" : "Add New Service"
            }
          >
            <ServiceForm
              formData={serviceForm}
              setFormData={setServiceForm}
              onSubmit={handleSaveService}
              editIndex={editServiceIndex}
              saving={savingService}
            />
          </ModalWrapper>
        )}
      </main>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);
