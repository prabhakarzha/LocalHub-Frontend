"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getEvents,
  editEvent,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";

import {
  GradientHeading,
  InputField,
  ModalWrapper,
  EventsTable,
} from "@/ui/eventHelpers";
import { PlusCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// PrimaryButton fixed ✅
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
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

type EventType = {
  _id?: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
};

export default function EventsPage() {
  const dispatch = useAppDispatch();

  const { events, loading } = useAppSelector(
    (state: RootState) =>
      state.events as { events: EventType[]; loading: boolean }
  );

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

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

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

  return (
    <div className="mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <GradientHeading text="Events" size="2xl" />
        <PrimaryButton onClick={handleCreate}>
          <PlusCircle className="w-5 h-5 mr-2 inline-block" /> Add Event
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
              placeholder="Enter Date"
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
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Event"}
            </PrimaryButton>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}
