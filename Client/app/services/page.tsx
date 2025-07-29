"use client";

import { useState, useEffect } from "react";
import { PhoneCall, DollarSign, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { getServices } from "@/src/redux/slices/servicesSlice";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const { services, loading } = useAppSelector(
    (state: RootState) => state.services
  );

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    dispatch(getServices()); // Fetch services from API
  }, [dispatch]);

  const handleContact = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  return (
    <div className="py-16 container mx-auto px-6">
      {/* Heading */}
      <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Explore Local Services
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Connect with trusted tutors, repair experts, and local businesses.
      </p>

      {/* Success Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center animate-fade-in">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Contact Initiated!
            </h2>
            <p className="text-gray-700 mb-4">
              The service provider will get back to you shortly.
            </p>
            <button
              onClick={() => setPopupVisible(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-600 text-xl mt-10">
          Loading services...
        </div>
      )}

      {/* Service Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            <div className="relative w-full h-48">
              <Image
                src={service.image || "/images/default-placeholder.png"}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                onClick={handleContact}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition w-full"
              >
                Contact / Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
