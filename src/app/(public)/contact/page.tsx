"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const sending = toast.loading("Sending message...");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      toast.dismiss(sending);
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F9FAFB] text-[#111827] overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white">
        <Image
          src="/image/contact-bg.jpg"
          alt="Contact Hero"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-[#0A3D79]/50"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-4 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-oswald font-bold mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            Let’s collaborate to bring your fashion ideas to life.
          </p>
        </motion.div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-[3px] bg-[#124E9C] rounded-md mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-oswald font-bold text-[#0A3D79] mb-6">
              Let's Build Something Great
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you’re launching your first collection or expanding your
              brand, The Garment Guy is your trusted partner for world-class
              garment production and design collaboration.
            </p>

            <ul className="space-y-4 text-gray-700 text-base">
              <li>
                <span className="font-semibold text-[#124E9C]">Email:</span>{" "}
                info@thegarmentguy.com
              </li>
              <li>
                <span className="font-semibold text-[#124E9C]">Phone:</span>{" "}
                +91 98765 43210
              </li>
              <li>
                <span className="font-semibold text-[#124E9C]">Address:</span>{" "}
                Mumbai, India
              </li>
            </ul>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D79] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D79] outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D79] outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A3D79] text-white py-3 rounded-lg font-semibold hover:bg-[#124E9C] transition disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
