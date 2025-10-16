"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import AddEventModal from "@/app/components/shared/AddEventModal";
import AddServiceModal from "@/app/components/shared/AddServiceModal";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { getUserEvents } from "@/src/redux/slices/eventsSlice";
import { getUserServices } from "@/src/redux/slices/servicesSlice";

import { getServices } from "@/src/redux/slices/servicesSlice";

function SimpleModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-xl p-6 w-80 max-w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        <div className="text-white">{children}</div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { token, user } = useAppSelector((state: any) => state.auth);
  const { events: userEvents } = useAppSelector((state: any) => state.events);
  const { services: UserServices } = useAppSelector(
    (state: any) => state.services
  );
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserEvents(user._id));
      dispatch(getUserServices(user._id));

      dispatch(getServices());
    }
  }, [user, dispatch]);

  const userServices = UserServices.filter(
    (service: any) => service.createdBy?._id === user?._id
  );

  const stats = [
    {
      title: "User Events",
      value: userEvents.length,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "User Services",
      value: userServices.length,
      icon: <ClipboardList className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Earnings",
      value: "$1,250",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
    },
  ];

  const actions = [
    {
      label: "Add Event",
      icon: <PlusCircle className="w-5 h-5" />,
      onClick: () => setShowEventModal(true),
    },
    {
      label: "Add Service",
      icon: <ClipboardList className="w-5 h-5" />,
      onClick: () => setShowServiceModal(true),
    },
    {
      label: "View Bookings",
      icon: <Users className="w-5 h-5" />,
      onClick: () => alert("View Bookings clicked ✅"),
    },
  ];

  return (
    <div className="py-16 container mx-auto px-6 min-h-screen text-white pt-24">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Dashboard Overview
      </h1>

      {/* ✅ Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${item.color} text-white text-center`}
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ✅ Actions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow hover:shadow-lg py-4 text-lg font-semibold transition hover:scale-105"
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* ✅ Add Event Modal */}
      {showEventModal && (
        <AddEventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={async (formData, isEdit) => {
            try {
              if (!token) {
                alert("You must be logged in to create an event!");
                return;
              }

              const url = `${API_BASE_URL}/api/events`;
              const options: RequestInit = {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              };

              const res = await fetch(url, options);
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create event");
              }

              dispatch(getUserEvents(user._id));
              setSuccessMessage("Event Created Successfully!");
              setShowSuccess(true);
            } catch (err: any) {
              console.error("Error creating event:", err);
              alert(`Failed to save event: ${err.message}`);
            }

            setShowEventModal(false);
          }}
        />
      )}

      {/* ✅ Add Service Modal (Same Logic as Event) */}
      {showServiceModal && (
        <AddServiceModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onSave={async (formData: FormData) => {
            try {
              if (!token) {
                alert("You must be logged in to add a service!");
                return;
              }

              const url = `${API_BASE_URL}/api/services`;
              const options: RequestInit = {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              };

              const res = await fetch(url, options);
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to add service");
              }

              dispatch(getServices());
              setSuccessMessage("Service Added Successfully!");
              setShowSuccess(true);
            } catch (err: any) {
              console.error("Error adding service:", err);
              alert(`Failed to save service: ${err.message}`);
            }

            setShowServiceModal(false);
          }}
        />
      )}

      {/* ✅ Success Popup */}
      <SimpleModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMessage}
      >
        <p className="text-white text-center">
          Your request has been submitted successfully.
          <br />
          Please wait for admin approval.
        </p>
      </SimpleModal>
    </div>
  );
}
