"use client";

import { useEffect, useState } from "react";

interface SettingsForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  emailNotifications: boolean;
  darkMode: boolean;
  role: string;
}

export default function BuyerSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    emailNotifications: true,
    darkMode: false,
    role: "buyer",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            ...data,
            emailNotifications:
              data.emailNotifications ?? data.notifications ?? true,
          }));
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Save changes to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          emailNotifications: form.emailNotifications,
          darkMode: form.darkMode,
        }),
      });
      if (res.ok) alert("Settings updated successfully!");
      else alert("Failed to update settings.");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Error saving settings. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading settings...</p>
      </main>
    );

  return (
    <main className="p-8 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-2">Account Settings</h1>
      <p className="text-gray-600 mb-6">Manage your profile and dashboard preferences.</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-2xl space-y-8"
      >
        {/* Personal Info */}
        <section>
          <h2 className="text-xl font-semibold text-[#0A3D79] mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0A3D79]"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email changes are handled by account support.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0A3D79]"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0A3D79]"
                placeholder="Your location"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-xl font-semibold text-[#0A3D79] mb-4">Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={form.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-[#0A3D79]"
              />
              <span className="text-gray-700">Enable Email Notifications</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="darkMode"
                checked={form.darkMode}
                onChange={handleChange}
                className="w-5 h-5 text-[#0A3D79]"
              />
              <span className="text-gray-700">Enable Dark Mode</span>
            </label>
          </div>
        </section>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`bg-[#0A3D79] text-white px-6 py-3 rounded-lg font-semibold transition ${
              saving ? "opacity-70 cursor-not-allowed" : "hover:bg-[#124E9C]"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
