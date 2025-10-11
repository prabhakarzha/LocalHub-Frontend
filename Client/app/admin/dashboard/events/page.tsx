"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { RootState, AppDispatch } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getEvents,
  editEvent,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";
import { GradientHeading, EventsTable } from "@/ui/eventHelpers";
import { PlusCircle } from "lucide-react";
import AddEventModal from "@/app/components/shared/AddEventModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Button props
type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base ${className}`}
    >
      {children}
    </button>
  );
}

// ✅ Event type
export type EventType = {
  _id?: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image?: string;
};

export default function EventsPage() {
  const dispatch: AppDispatch = useAppDispatch();

  // ✅ Get admin token here
  const { token } = useAppSelector((state: RootState) => state.auth);

  const { events, loading } = useAppSelector((state: RootState) => ({
    events: state.events.events as EventType[],
    loading: state.events.loading,
  }));

  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState<EventType | null>(null);

  // ✅ Fetch events on mount
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleCreate = () => {
    setEditEventData(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    const selectedEvent = events[index];
    if (!selectedEvent) return;
    setEditEventData(selectedEvent);
    setShowModal(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventId = events[index]?._id;
      if (eventId) dispatch(removeEvent(eventId));
    }
  };

  // ✅ Fixed handleSave: include Authorization token
  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    eventId?: string
  ): Promise<void> => {
    try {
      if (!token) {
        alert("You must be logged in as admin to create/edit events.");
        return;
      }

      if (isEdit && eventId) {
        // Use axios directly for editing to include token
        await axios.put(`${API_BASE_URL}/api/events/${eventId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(getEvents());
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(getEvents());
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="mt-6 sm:mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <GradientHeading text="Events" size="2xl" />
        <div className="flex justify-end">
          <PrimaryButton onClick={handleCreate} className="w-full sm:w-auto">
            <PlusCircle className="w-5 h-5" />
            <span>Add Event</span>
          </PrimaryButton>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-black/70 rounded-xl shadow-inner overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-full">
          <EventsTable
            events={events}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddEventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={editEventData} // ← use initialData instead of eventData
          onSave={handleSave}
        />
      )}
    </div>
  );
}
