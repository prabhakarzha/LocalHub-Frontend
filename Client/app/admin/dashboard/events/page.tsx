"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { RootState, AppDispatch } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loadEventsReducer } from "@/src/redux/store";
import {
  getEvents,
  editEvent,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";
import { PlusCircle } from "lucide-react";

// Import your existing Pagination component
import { Pagination } from "@/app/components/admin/Pagination";

// ✅ Fix 1: Import GradientHeading with 'as any'
import { GradientHeading as GH } from "@/ui/eventHelpers";
const GradientHeading = GH as any;

// ✅ Fix 2: Store the lazy loaded component in a variable with type any
const EventsTableComponent = lazy(() =>
  import("@/ui/eventHelpers").then((mod) => ({
    default: mod.EventsTable,
  })),
);
const EventsTable = EventsTableComponent as any;

const AddEventModal = lazy(
  () => import("@/app/components/shared/AddEventModal"),
);
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

// ✅ Loading fallbacks
const TableFallback = () => (
  <div className="bg-black/70 rounded-xl shadow-inner overflow-x-auto">
    <div className="min-w-[600px] sm:min-w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  </div>
);

const ModalFallback = () => null;

export default function EventsPage() {
  const dispatch: AppDispatch = useAppDispatch();

  // ✅ Track reducer loading state
  const [isReducerLoaded, setIsReducerLoaded] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Match the limit in your API

  // ✅ Get admin token here
  const { token } = useAppSelector((state: RootState) => state.auth);

  // ✅ Fix 3: Properly access state
  const eventsState = useAppSelector(
    (state: RootState) => (state as any).events,
  );
  const events = eventsState?.events || [];
  const loading = eventsState?.loading || false;
  const pagination = eventsState?.pagination || { total: 0, totalPages: 1 };

  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState<EventType | null>(null);

  // ✅ Lazy load events reducer when component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await loadEventsReducer();
        setIsReducerLoaded(true);
        // Fetch events after reducer is loaded
        dispatch(getEvents({ page: currentPage, limit: itemsPerPage }) as any);
      } catch (error) {
        console.error("Failed to load events reducer:", error);
      }
    };

    loadEvents();
  }, [dispatch]);

  // ✅ Fetch events when page changes
  useEffect(() => {
    if (isReducerLoaded) {
      dispatch(getEvents({ page: currentPage, limit: itemsPerPage }) as any);
    }
  }, [dispatch, currentPage, isReducerLoaded]);

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
      if (eventId) {
        dispatch(removeEvent(eventId) as any).then(() => {
          // Refresh current page after delete
          dispatch(
            getEvents({ page: currentPage, limit: itemsPerPage }) as any,
          );
        });
      }
    }
  };

  // ✅ Fixed handleSave: include Authorization token
  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    eventId?: string,
  ): Promise<void> => {
    try {
      if (!token) {
        alert("You must be logged in as admin to create/edit events.");
        return;
      }

      if (isEdit && eventId) {
        await axios.put(`${API_BASE_URL}/events/${eventId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        // Stay on current page after edit
        dispatch(getEvents({ page: currentPage, limit: itemsPerPage }) as any);
      } else {
        await axios.post(`${API_BASE_URL}/events`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        // Go to first page after creating new event
        setCurrentPage(1);
        dispatch(getEvents({ page: 1, limit: itemsPerPage }) as any);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  // ✅ Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ✅ Show loading state while reducer is loading
  if (!isReducerLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

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

      {/* Events Table Container - Lazy loaded */}
      <Suspense fallback={<TableFallback />}>
        <EventsTable
          events={events}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Suspense>

      {/* ✅ Use existing Pagination component */}
      {pagination.totalPages > 1 && (
        <Pagination
          page={currentPage}
          hasNext={currentPage < pagination.totalPages}
          onPrev={handlePreviousPage}
          onNext={handleNextPage}
        />
      )}

      {/* Add/Edit Modal - Lazy loaded */}
      {showModal && (
        <Suspense fallback={<ModalFallback />}>
          <AddEventModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            initialData={editEventData}
            onSave={handleSave}
          />
        </Suspense>
      )}
    </div>
  );
}
