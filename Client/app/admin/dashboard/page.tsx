"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  LayoutDashboard,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEvents,
  addEvent,
  editEvent,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";
import {
  GradientHeading,
  PrimaryButton,
  InputField,
  ModalWrapper,
  StatCard,
  EventsTable,
  EventForm,
} from "@/ui/uiHelpers";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();

  // Redux state
  const { events, loading } = useSelector((state) => state.events);

  // Local UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    price: "",
    image: "",
  });

  // Load events from API using Redux
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  // Stats Section
  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: <Calendar className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Total Users",
      value: 120,
      icon: <Users className="w-6 h-6 text-white" />,
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

  const handleCreate = () => {
    setFormData({ title: "", date: "", location: "", price: "", image: "" });
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    setFormData(events[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventId = events[index]._id;
      dispatch(removeEvent(eventId));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editIndex !== null) {
        const id = events[editIndex]._id;
        await dispatch(editEvent({ id, eventData: formData }));
      } else {
        await dispatch(addEvent(formData));
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <GradientHeading text="Admin Dashboard" size="4xl" />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Manage Events */}
        <div className="mt-12 sm:mt-16 bg-white p-4 sm:p-8 rounded-2xl shadow-lg overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <GradientHeading text="Manage Events" size="2xl" />
            <div className="flex-shrink-0">
              <PrimaryButton onClick={handleCreate}>
                <PlusCircle className="w-5 h-5 mr-2 inline-block" /> Create
                Event
              </PrimaryButton>
            </div>
          </div>

          <EventsTable
            events={events}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <ModalWrapper
            onClose={() => setShowModal(false)}
            title={editIndex !== null ? "Edit Event" : "Create New Event"}
          >
            <EventForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSave}
              editIndex={editIndex}
              PrimaryButton={PrimaryButton}
              InputField={InputField}
              saving={saving}
            />
          </ModalWrapper>
        )}
      </main>
    </div>
  );
}
