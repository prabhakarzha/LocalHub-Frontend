"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import MotionDiv from "./MotionDiv";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // API call here
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 text-center"
    >
      <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
        Get weekly updates about events and services in your area
      </p>

      {subscribed ? (
        <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg">
          Thanks for subscribing! 🎉
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-lg text-white font-medium hover:scale-105 transition"
          >
            <Mail className="w-5 h-5" />
          </button>
        </form>
      )}
    </MotionDiv>
  );
}
