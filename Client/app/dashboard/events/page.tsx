"use client";

import AddEventModal from "@/app/components/shared/AddEventModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getEvents } from "@/src/redux/slices/eventsSlice";
import { EventsTable } from "@/ui/eventHelpers";

type EventType = {
  _id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image?: string;
};

export default function UserEvents() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState<EventType | null>(null);

  const { token } = useAppSelector((state: any) => state.auth);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const formatDateForInput = (isoDate?: string) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    eventId?: string
  ) => {
    try {
      if (!token) {
        alert("You must be logged in to create an event!");
        return;
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
        alert(
          "Event created successfully! It will appear on the events page once approved by admin."
        );
      }

      dispatch(getEvents());
      setShowModal(false);
      setEditEventData(null);
    } catch (err: any) {
      console.error("Error saving event:", err.response || err.message);
      alert(
        `Failed to save event: ${err.response?.data?.message || err.message}`
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
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => {
          setEditEventData(null);
          setShowModal(true);
        }}
      >
        Add Event
      </button>

      <EventsTable
        events={events as EventType[]} // ✅ fixed type assertion
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {showModal && (
        <AddEventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editEventData}
        />
      )}
    </div>
  );
}
