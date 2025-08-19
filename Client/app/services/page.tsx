"use client";

import { useEffect, useState } from "react";
import { PhoneCall, DollarSign, CheckCircle } from "lucide-react";
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
        setPopupVisible(false);
        setContactNumber("");
        setUserMessage("");
        router.push("/profile");
      })
      .catch(() => alert("Failed to book service. Try again."));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-200">
        Loading services...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-16">
      {/* Overlay blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 backdrop-blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
          Explore Local Services
        </h1>
        <p className="text-center text-gray-200 mt-4 max-w-2xl mx-auto">
          Connect with trusted tutors, repair experts, and local businesses.
        </p>

        {/* Booking Popup */}
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-5 animate-fade-in">
              {/* Gradient Heading */}
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-md">
                Book This Service
              </h2>

              {/* Input - Contact Number */}
              <input
                type="text"
                placeholder="Your Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Input - Message */}
              <textarea
                placeholder="Your Message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-4 py-2 rounded-lg h-24 resize-none text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setPopupVisible(false)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:scale-105 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookService}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:scale-105 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.length === 0 ? (
            <p className="col-span-3 text-center text-gray-200">
              No services available right now.
            </p>
          ) : (
            services.map((service: any) => (
              <div
                key={service._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform duration-300"
              >
                {/* Service Image */}
                <div className="relative w-full h-56">
                  <Image
                    src={
                      service.image && service.image.trim() !== ""
                        ? service.image
                        : "/images/default-placeholder.png"
                    }
                    alt={service.title || "Service Image"}
                    fill
                    className="object-cover object-center rounded-t-2xl"
                    unoptimized
                  />
                </div>

                {/* Service Content */}
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>

                  <div className="flex items-center text-sm gap-2 mb-2 text-gray-300">
                    <PhoneCall className="w-4 h-4 text-green-300" />{" "}
                    {service.contact}
                  </div>
                  <div className="flex items-center text-sm gap-2 mb-4 text-gray-300">
                    <DollarSign className="w-4 h-4 text-yellow-300" />{" "}
                    {service.price}
                  </div>

                  <button
                    onClick={() => openBookingPopup(service._id)}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2 rounded-lg hover:scale-105 transition shadow-md"
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
