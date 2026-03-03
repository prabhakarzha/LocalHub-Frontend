"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { RootState } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loadServicesReducer } from "@/src/redux/store";
import {
  getServices,
  addService,
  editService,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import { PlusCircle } from "lucide-react";

// ✅ Fix 1: Import GradientHeading with 'as any'
import { GradientHeading as GH } from "@/ui/eventHelpers";
const GradientHeading = GH as any;

// ✅ Fix 2: Lazy load ServicesTable with 'as any'
const ServicesTableComponent = lazy(() =>
  import("@/ui/serviceHelpers").then((mod) => ({
    default: mod.ServicesTable,
  })),
);
const ServicesTable = ServicesTableComponent as any;

// ✅ Fix 3: Lazy load AddServiceModal
const AddServiceModal = lazy(
  () => import("@/app/components/shared/AddServiceModal"),
);

type ServiceType = {
  _id?: string;
  title: string;
  category: "Tutor" | "Repair" | "Business";
  description: string;
  contact: string;
  price: string;
  image?: File | null;
  userId?: string;
};

// ✅ Fix 4: Properly type PrimaryButton
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

// ✅ Loading fallbacks
const TableFallback = () => (
  <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden border border-gray-800">
    <div className="overflow-x-auto min-w-[600px] sm:min-w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  </div>
);

const ModalFallback = () => null;

export default function UserServicesPage() {
  const dispatch = useAppDispatch();

  // ✅ Fix 5: Track reducer loading state
  const [isReducerLoaded, setIsReducerLoaded] = useState(false);

  // ✅ Fix 6: Properly access state
  const servicesState = useAppSelector(
    (state: RootState) => (state as any).services,
  );
  const { user } = useAppSelector((state: RootState) => state.auth);

  const services = servicesState?.services || [];
  const servicesLoading = servicesState?.loading || false;

  const [showModal, setShowModal] = useState(false);
  const [editServiceData, setEditServiceData] = useState<ServiceType | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  // Lazy load services reducer when component mounts
  useEffect(() => {
    const loadServices = async () => {
      try {
        await loadServicesReducer();
        setIsReducerLoaded(true);
        // Fetch services after reducer is loaded
        dispatch(getServices() as any);
      } catch (error) {
        console.error("Failed to load services reducer:", error);
      }
    };

    loadServices();
  }, [dispatch]);

  // Filter only logged-in user's services
  const userServices =
    services?.filter((service: ServiceType) => service.userId === user?._id) ||
    [];

  const handleCreate = () => {
    setEditServiceData(null);
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    const service = userServices[index];
    if (!service) return;
    setEditServiceData(service);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await dispatch(removeService(id) as any);
    }
  };

  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    serviceId?: string,
  ) => {
    try {
      setSaving(true);
      if (user?._id) formData.append("userId", user._id);

      if (isEdit && serviceId) {
        await dispatch(
          editService({ id: serviceId, serviceData: formData }) as any,
        );
      } else {
        await dispatch(addService(formData) as any);
      }

      // Refresh services after save
      dispatch(getServices() as any);

      setShowModal(false);
      setEditServiceData(null);
    } catch (error: any) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (!isReducerLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        {/* ✅ text error fixed */}
        <GradientHeading text="My Services" size="2xl" />
        <div className="w-full sm:w-auto flex justify-end">
          <PrimaryButton
            onClick={handleCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2"
            disabled={saving}
          >
            <PlusCircle className="w-5 h-5" /> Add Service
          </PrimaryButton>
        </div>
      </div>

      {/* Services Table - Lazy loaded */}
      <Suspense fallback={<TableFallback />}>
        <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            {/* ✅ services error fixed - using ServicesTable as any */}
            <ServicesTable
              services={userServices}
              loading={servicesLoading}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </Suspense>

      {/* Add/Edit Modal - Lazy loaded */}
      {showModal && (
        <Suspense fallback={<ModalFallback />}>
          <AddServiceModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditServiceData(null);
            }}
            initialData={editServiceData}
            onSave={handleSave}
          />
        </Suspense>
      )}
    </div>
  );
}
