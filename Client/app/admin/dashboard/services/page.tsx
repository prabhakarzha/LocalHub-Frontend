"use client";

import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import axios from "axios";
import { RootState, AppDispatch } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loadServicesReducer } from "@/src/redux/store";
import {
  getServices,
  addService,
  editService,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import { PlusCircle } from "lucide-react";

// Import Pagination component
import { Pagination } from "@/app/components/admin/Pagination";

// ✅ Fix: Import GradientHeading with 'as any'
import { GradientHeading as GH } from "@/ui/eventHelpers";
const GradientHeading = GH as any;

// ✅ Fix: Lazy load ServicesTable correctly (as a component, not as a function)
const ServicesTable = lazy(() =>
  import("@/ui/serviceHelpers").then((mod) => ({
    default: mod.ServicesTable,
  })),
) as unknown as React.ComponentType<any>;

const AddServiceModal = lazy(
  () => import("@/app/components/shared/AddServiceModal"),
);

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ✅ Service type
export type ServiceType = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  contact: string;
  price: string;
  image?: string;
  status?: string;
  createdBy?: {
    _id: string;
    name: string;
  };
};

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

// ✅ Loading fallbacks
const TableFallback = () => (
  <div className="bg-black/70 rounded-xl shadow-inner overflow-x-auto">
    <div className="min-w-[600px] sm:min-w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  </div>
);

const ModalFallback = () => null;

export default function ServicesPage() {
  const dispatch: AppDispatch = useAppDispatch();

  // ✅ Track reducer loading state
  const [isReducerLoaded, setIsReducerLoaded] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Match the limit in your API

  // ✅ Get admin token here
  const { token } = useAppSelector((state: RootState) => state.auth);

  // ✅ Fix: Properly access state
  const servicesState = useAppSelector(
    (state: RootState) => (state as any).services,
  );
  const services = servicesState?.services || [];
  const loading = servicesState?.loading || false;
  const pagination = servicesState?.pagination || { total: 0, totalPages: 1 };

  const [showModal, setShowModal] = useState(false);
  const [editServiceData, setEditServiceData] = useState<ServiceType | null>(
    null,
  );

  // ✅ Lazy load services reducer when component mounts
  useEffect(() => {
    const loadServices = async () => {
      try {
        await loadServicesReducer();
        setIsReducerLoaded(true);
        // Fetch services after reducer is loaded with pagination
        dispatch(
          getServices({ page: currentPage, limit: itemsPerPage }) as any,
        );
      } catch (error) {
        console.error("Failed to load services reducer:", error);
      }
    };

    loadServices();
  }, [dispatch]);

  // ✅ Fetch services when page changes
  useEffect(() => {
    if (isReducerLoaded) {
      dispatch(getServices({ page: currentPage, limit: itemsPerPage }) as any);
    }
  }, [dispatch, currentPage, isReducerLoaded]);

  const handleCreate = () => {
    setEditServiceData(null);
    setShowModal(true);
  };

  const handleEdit = (service: ServiceType) => {
    setEditServiceData(service);
    setShowModal(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const serviceId = services[index]?._id;
      if (serviceId) {
        dispatch(
          removeService({ id: serviceId, page: currentPage }) as any,
        ).then(() => {
          // If current page becomes empty after delete and not first page, go to previous page
          if (services.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        });
      }
    }
  };

  // ✅ Fixed handleSave with pagination
  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    serviceId?: string,
  ): Promise<void> => {
    try {
      if (!token) {
        alert("You must be logged in as admin to create/edit services.");
        return;
      }

      if (isEdit && serviceId) {
        await axios.put(`${API_BASE_URL}/services/${serviceId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh after edit - stay on current page
        dispatch(
          getServices({ page: currentPage, limit: itemsPerPage }) as any,
        );
      } else {
        await axios.post(`${API_BASE_URL}/services`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        // After creating new service, go to first page to see it
        setCurrentPage(1);
        dispatch(getServices({ page: 1, limit: itemsPerPage }) as any);
      }

      setShowModal(false);
      setEditServiceData(null);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  // ✅ Pagination handlers
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, pagination.totalPages]);

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
        <GradientHeading text="Services" size="2xl" />
        <div className="flex justify-end">
          <PrimaryButton onClick={handleCreate} className="w-full sm:w-auto">
            <PlusCircle className="w-5 h-5" />
            <span>Add Service</span>
          </PrimaryButton>
        </div>
      </div>

      {/* Services Table - Lazy loaded */}
      <Suspense fallback={<TableFallback />}>
        <ServicesTable
          services={services}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Suspense>

      {/* Pagination Component - Only show if more than 1 page */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={currentPage}
            hasNext={currentPage < pagination.totalPages}
            onPrev={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>
      )}

      {/* Add/Edit Modal - Lazy loaded */}
      {showModal && (
        <Suspense fallback={<ModalFallback />}>
          <AddServiceModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            initialData={editServiceData as any}
            onSave={handleSave}
          />
        </Suspense>
      )}
    </div>
  );
}
