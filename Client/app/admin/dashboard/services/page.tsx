"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/src/redux/store";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getServices,
  addService,
  editService,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import { GradientHeading } from "@/ui/eventHelpers";
import { ServicesTable } from "@/ui/serviceHelpers";
import { PlusCircle } from "lucide-react";
import AddServiceModal from "@/app/components/shared/AddServiceModal";

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

// ✅ PrimaryButton with flex & gap like EventsPage
function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base ${className}`}
    >
      {children}
    </button>
  );
}

export default function ServicesPage() {
  const dispatch = useAppDispatch();

  const { services, loading } = useAppSelector((state: RootState) => ({
    services: state.services.services as ServiceType[],
    loading: state.services.loading,
  }));

  const user = useAppSelector((state: RootState) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [editServiceData, setEditServiceData] = useState<ServiceType | null>(
    null
  );

  // ✅ Fetch services on mount
  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const handleCreate = () => {
    setEditServiceData(null);
    setShowModal(true);
  };

  const handleEdit = (service: ServiceType) => {
    setEditServiceData(service);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await dispatch(removeService(id) as any);
    }
  };

  // ✅ handleSave mirrors EventsPage, adds userId if available
  const handleSave = async (
    formData: FormData,
    isEdit: boolean,
    serviceId?: string
  ) => {
    try {
      // ❌ Removed manual userId append
      // if (user?._id) formData.append("userId", user._id);

      // ✅ Optional: Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log("FormData entry:", key, value);
      }

      if (isEdit && serviceId) {
        await dispatch(
          editService({ id: serviceId, serviceData: formData }) as any
        );
      } else {
        await dispatch(addService(formData) as any);
      }

      setShowModal(false);
      setEditServiceData(null);
    } catch (error: any) {
      console.log("Full error object:", error);
      console.log("Error response:", error.response);
      console.log("Error message:", error.message);
      alert("Failed to create service. Check console for details.");
    }
  };

  return (
    <div className="mt-6 sm:mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <GradientHeading text="Services" size="2xl" />
        <div className="w-full sm:w-auto flex justify-end">
          <PrimaryButton onClick={handleCreate}>
            <PlusCircle className="w-5 h-5" />
            <span>Add Service</span>
          </PrimaryButton>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden border border-gray-800">
        <div className="overflow-x-auto min-w-[600px] sm:min-w-full">
          <ServicesTable
            services={services}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddServiceModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditServiceData(null);
          }}
          initialData={editServiceData} // ✅ mirrors EventsPage
          onSave={handleSave}
        />
      )}
    </div>
  );
}
