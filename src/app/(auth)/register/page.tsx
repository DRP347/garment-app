"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type AccountType = "buyer" | "seller";

const accountOptions: Array<{
  value: AccountType;
  title: string;
  description: string;
}> = [
  {
    value: "buyer",
    title: "Buyer",
    description: "I want to buy garments",
  },
  {
    value: "seller",
    title: "Seller",
    description: "I want to sell/list garments",
  },
];

const sellerBusinessTypeOptions = [
  "Manufacturer",
  "Exporter",
  "Supplier",
  "Factory",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    accountType: "buyer" as AccountType,
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessType: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const setAccountType = (accountType: AccountType) => {
    setForm((current) => ({
      ...current,
      accountType,
      businessType:
        accountType === "seller" ? sellerBusinessTypeOptions[0] : "",
      businessName: "",
      location: "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          form.accountType === "seller"
            ? {
                accountType: form.accountType,
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                businessName: form.businessName,
                shopName: form.businessName,
                businessType: form.businessType,
                location: form.location,
              }
            : {
                accountType: form.accountType,
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
              }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success("Account created. Please log in.");
        router.push("/login");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0A3D79]/70">
            Create account
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#0A3D79]">
            Join The Garment Guy
          </h1>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold">
            <div
              className={`rounded-lg border px-3 py-2 ${
                step === 1
                  ? "border-[#0A3D79] bg-[#0A3D79] text-white"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              1. Account type
            </div>
            <div
              className={`rounded-lg border px-3 py-2 ${
                step === 2
                  ? "border-[#0A3D79] bg-[#0A3D79] text-white"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              2. Details
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 px-6 py-6 sm:px-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                What do you want to do?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose one account type. Admin accounts are created only by the team.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {accountOptions.map((option) => {
                const selected = form.accountType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAccountType(option.value)}
                    className={`rounded-xl border p-5 text-left transition ${
                      selected
                        ? "border-[#0A3D79] bg-[#EAF1FF] shadow-sm"
                        : "border-slate-200 bg-white hover:border-[#0A3D79]/40 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-base font-semibold text-[#0A3D79]">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-lg bg-[#0A3D79] px-4 py-3 font-semibold text-white transition hover:bg-[#124E9C]"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8">
            <div className="rounded-lg border border-[#0A3D79]/15 bg-[#F4F7FB] px-4 py-3 text-sm text-slate-700">
              Registering as{" "}
              <span className="font-semibold text-[#0A3D79]">
                {form.accountType === "buyer" ? "Buyer" : "Seller"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <Field
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />

            <Field
              label="Password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />

            {form.accountType === "seller" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Business / Company Name"
                    name="businessName"
                    required
                    value={form.businessName}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      required
                      value={form.businessType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/20"
                    >
                      {sellerBusinessTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Field
                  label="City / Location (optional)"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#0A3D79] px-6 py-2.5 font-semibold text-white transition hover:bg-[#124E9C] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-slate-100 px-6 py-5 text-center text-sm text-slate-600 sm:px-8">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0A3D79] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field(
  props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>
) {
  const { label, ...inputProps } = props;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#0A3D79] focus:ring-2 focus:ring-[#0A3D79]/20"
      />
    </div>
  );
}
