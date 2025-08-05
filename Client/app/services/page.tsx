"use client";

import { useEffect, useState } from "react";
import {
  PhoneCall,
  DollarSign,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getServices } from "@/src/redux/slices/servicesSlice";
import { bookService } from "@/src/redux/slices/serviceBookingSlice";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { services, loading } = useAppSelector((state) => state.services);
  const { token } = useAppSelector((state) => state.auth);

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [contactNumber, setContactNumber] = useState("");
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const openBookingPopup = (serviceId: string) => {
    if (!token) {
      alert("Please login to book services!");
      router.push("/login");
      return;
    }
    setSelectedServiceId(serviceId);
    setPopupVisible(true);
  };

  const handleBookService = () => {
    if (!selectedServiceId || !contactNumber.trim() || !userMessage.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(
      bookService({
        serviceId: selectedServiceId,
        message: userMessage.trim(),
        contactInfo: contactNumber.trim(),
      })
    )
      .then(() => {
        alert("Service booked successfully!");
        setPopupVisible(false);
        setContactNumber("");
        setUserMessage("");
        router.push("/profile");
      })
      .catch(() => alert("Failed to book service. Try again."));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading services...
      </div>
    );
  }

  return (
    <div className="py-16 container mx-auto px-6">
      <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Explore Local Services
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Connect with trusted tutors, repair experts, and local businesses.
      </p>

      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Book This Service
            </h2>

            <input
              type="text"
              placeholder="Your Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />

            <textarea
              placeholder="Your Message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg h-24 resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPopupVisible(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleBookService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">
            No services available right now.
          </p>
        ) : (
          services.map((service: any) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={service.image || "/images/default-placeholder.png"}
                  alt={service.title}
                  fill
                  className="w-full h-[250px] object-cover object-center rounded-t-xl"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center text-gray-500 text-sm gap-2 mb-2">
                  <PhoneCall className="w-4 h-4" /> {service.contact}
                </div>
                <div className="flex items-center text-gray-500 text-sm gap-2 mb-4">
                  <DollarSign className="w-4 h-4" /> {service.price}
                </div>
                <button
                  onClick={() => openBookingPopup(service._id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition w-full"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
