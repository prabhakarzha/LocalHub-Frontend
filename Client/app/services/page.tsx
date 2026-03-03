"use client";

import { useEffect, useState } from "react";
import { PhoneCall, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getServices, ServiceType } from "@/src/redux/slices/servicesSlice";
import { bookService } from "@/src/redux/slices/serviceBookingSlice";

// Extend ServiceType to include status
interface ServiceWithStatus extends ServiceType {
  status?: string;
  createdBy?: {
    name: string;
    email: string;
    _id?: string;
  };
}

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✅ FIX 1: Safe state access with fallbacks
  const servicesState = useAppSelector((state) => state.services);
  const authState = useAppSelector((state) => state.auth);

  const services = (servicesState?.services as ServiceWithStatus[]) || [];
  const loading = servicesState?.loading || false;
  const token = authState?.token || null;

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [contactNumber, setContactNumber] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ✅ FIX 2: Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter only approved services for public view
  const approvedServices = services.filter(
    (service: ServiceWithStatus) =>
      service.status === "approved" || !service.status,
  );

  // ✅ FIX 3: Load services only after mounted
  useEffect(() => {
    if (!mounted) return;

    const loadServices = async () => {
      try {
        setFetchError(null);
        await dispatch(getServices() as any);
      } catch (error: any) {
        console.error("Failed to fetch services:", error);
        setFetchError(error?.message || "Failed to load services");
      }
    };

    loadServices();
  }, [dispatch, mounted]);

  const openBookingPopup = (serviceId: string) => {
    if (!token) {
      alert("Please login to book services!");
      router.push("/login");
      return;
    }
    setSelectedServiceId(serviceId);
    setPopupVisible(true);
  };

  const handleBookService = async () => {
    if (!selectedServiceId || !contactNumber.trim() || !userMessage.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setBookingLoading(true);

    try {
      await dispatch(
        bookService({
          serviceId: selectedServiceId,
          message: userMessage.trim(),
          contactInfo: contactNumber.trim(),
        }) as any,
      );

      setPopupVisible(false);
      setContactNumber("");
      setUserMessage("");
      alert("Service booked successfully!");
      router.push("/profile");
    } catch (error: any) {
      console.error("Failed to book service:", error);
      alert(error?.message || "Failed to book service. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ✅ FIX 4: Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-white">Loading services...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <p className="text-red-400 mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24">
      <div className="container mx-auto relative z-10">
        {/* Heading */}
        <div className="mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
            Explore Local Services
          </h1>
          <p className="text-center text-gray-300 mt-5 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base">
            Connect with trusted tutors, repair experts, and local businesses.
          </p>
        </div>

        {/* Booking Popup */}
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="relative backdrop-blur-lg bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-5 animate-fade-in">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-md">
                Book This Service
              </h2>

              <input
                type="text"
                placeholder="Your Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={bookingLoading}
              />

              <textarea
                placeholder="Your Message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-4 py-2 rounded-lg h-24 resize-none text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={bookingLoading}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setPopupVisible(false);
                    setContactNumber("");
                    setUserMessage("");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookService}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {approvedServices.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-300 text-lg">
                No services available right now.
              </p>
            </div>
          ) : (
            approvedServices.map((service: ServiceWithStatus) => (
              <div
                key={service._id}
                className="flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform duration-300 min-h-[420px]"
              >
                {/* Service Image */}
                <div className="relative w-full h-48">
                  <Image
                    src={
                      service.image && service.image.trim() !== ""
                        ? service.image
                        : "/images/default-placeholder.png"
                    }
                    alt={service.title || "Service Image"}
                    fill
                    className="object-cover object-center rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Service Content */}
                <div className="flex flex-col flex-1 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-sm flex-grow line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm gap-2 text-gray-300">
                      <PhoneCall className="w-4 h-4 text-green-300 shrink-0" />
                      <span className="truncate">{service.contact}</span>
                    </div>
                    <div className="flex items-center text-sm gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4 text-yellow-300 shrink-0" />
                      <span>{service.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookingPopup(service._id!)}
                    className="mt-auto w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2 rounded-lg hover:scale-105 transition shadow-md disabled:opacity-50"
                    disabled={bookingLoading}
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
