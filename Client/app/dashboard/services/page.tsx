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

function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export default function UserServicesPage() {
  const dispatch = useAppDispatch();
  const { services, loading } = useAppSelector(
    (state: RootState) =>
      state.services as { services: ServiceType[]; loading: boolean }
  );
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [editServiceData, setEditServiceData] = useState<ServiceType | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  // Filter only logged-in user's services
  const userServices = services.filter(
    (service) => service.userId === user?._id
  );

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
    serviceId?: string
  ) => {
    try {
      if (user?._id) formData.append("userId", user._id);

      // ✅ Log FormData entries to debug
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
      // ✅ Full error inspection
      console.error("Full Axios error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);

      alert("Failed to create service. Check console for full error details.");
    }
  };

  return (
    <div className="mt-6 sm:mt-8 bg-black/10 p-4 sm:p-8 rounded-2xl shadow-lg backdrop-blur-md overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <GradientHeading text="My Services" size="2xl" />
        <div className="w-full sm:w-auto flex justify-end">
          <PrimaryButton
            onClick={handleCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2"
          >
            <PlusCircle className="w-5 h-5" /> Add Service
          </PrimaryButton>
        </div>
      </div>

      <div className="bg-black/70 rounded-xl shadow-inner overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <ServicesTable
            services={userServices}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>

      {/* Reusable Modal Component */}
      <AddServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditServiceData(null);
        }}
        initialData={editServiceData}
        onSave={handleSave}
      />
    </div>
  );
}
