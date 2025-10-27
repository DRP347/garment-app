"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterSellerPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/login'); // Redirect to login after successful registration
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const labelStyles = "block text-sm font-medium text-gray-700";
  const inputStyles = "w-full px-4 py-3 mt-1 text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-md";

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading">Become a Seller</h1>
        <p className="mt-2 text-gray-500">Create an account to list your products.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields are similar to buyer registration */}
        {/* ... form inputs ... */}
        <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold text-white bg-[var(--brand-gold)] rounded-md">
          {isSubmitting ? 'Creating Account...' : 'Create Seller Account'}
        </button>
      </form>
    </div>
  );
}