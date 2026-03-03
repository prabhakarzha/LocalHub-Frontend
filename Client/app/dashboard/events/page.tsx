"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loadEventsReducer } from "@/src/redux/store";
import { getEvents } from "@/src/redux/slices/eventsSlice";
import { PlusCircle } from "lucide-react";

// ✅ Fix 1: Lazy load EventsTable with 'as any'
const EventsTableComponent = lazy(() =>
  import("@/ui/eventHelpers").then((mod) => ({
    default: mod.EventsTable,
  })),
);
const EventsTable = EventsTableComponent as any;

// ✅ Fix 2: Lazy load AddEventModal
const AddEventModal = lazy(
  () => import("@/app/components/shared/AddEventModal"),
);

type EventType = {
  _id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image?: string;
  status?: string;
  createdBy?: {
    _id: string;
    name: string;
  };
};

// ✅ Loading fallbacks
const TableFallback = () => (
  <div className="bg-black/70 rounded-xl shadow-inner overflow-x-auto">
    <div className="min-w-[600px] sm:min-w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  </div>
);

const ModalFallback = () => null;

export default function UserEvents() {
  const dispatch = useAppDispatch();

  // ✅ Fix 3: Properly access state
  const eventsState = useAppSelector((state: any) => state.events);
  const { token, user } = useAppSelector((state: any) => state.auth);

  const events = eventsState?.events || [];
  const loading = eventsState?.loading || false;

  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState<EventType | null>(null);
  const [isReducerLoaded, setIsReducerLoaded] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const formatDateForInput = (isoDate?: string) => isoDate?.split("T")[0] || "";

  // ✅ Lazy load events reducer when component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await loadEventsReducer();
        setIsReducerLoaded(true);
        dispatch(getEvents({ page: 1, limit: 6 }) as any);
      } catch (error) {
        console.error("Failed to load events reducer:", error);
      }
    };

    loadEvents();
  }, [dispatch]);

  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    eventId?: string,
  ) => {
    try {
      if (!token) {
        alert("You must be logged in to create an event!");
        return;
      }

      if (!isEdit) {
        formData.append("createdBy", user?._id || "");
      }

      if (isEdit && eventId) {
        await axios.put(`${API_BASE_URL}/api/events/${eventId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Event updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Event created successfully! Waiting for admin approval.");
      }

      dispatch(getEvents({ page: 1, limit: 6 }) as any);
      setShowModal(false);
      setEditEventData(null);
    } catch (err: any) {
      console.error("Error saving event:", err.response || err.message);
      alert(
        `Failed to save event: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  const handleEdit = (event: EventType) => {
    setEditEventData({
      ...event,
      date: formatDateForInput(event.date),
    });
    setShowModal(true);
  };

  const handleDelete = (eventId: string) => {
    console.log("Delete event:", eventId);
    // Add actual delete logic here if needed
  };

  // ✅ Show loading state while reducer is loading
  if (!isReducerLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          My Events
        </h2>
        <div className="w-full sm:w-auto flex justify-end">
          <button
            onClick={() => {
              setEditEventData(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Events Table - Lazy loaded */}
      <Suspense fallback={<TableFallback />}>
        <div className="bg-black/70 rounded-xl shadow-inner overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full">
            {/* ✅ events error fixed - using EventsTable as any */}
            <EventsTable
              events={events}
              loading={loading}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </Suspense>

      {/* Add/Edit Modal - Lazy loaded */}
      {showModal && (
        <Suspense fallback={<ModalFallback />}>
          <AddEventModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            initialData={editEventData}
          />
        </Suspense>
      )}
    </div>
  );
}
