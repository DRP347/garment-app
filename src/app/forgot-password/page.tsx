"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || 'An error occurred.');
            }
        } catch (err) {
            setError('An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const inputStyles = "w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold";
    const labelStyles = "block text-sm font-medium text-gray-700";

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--brand-navy)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Forgot Your Password?</h1>
                    <p className="mt-2 text-gray-500">No problem. Enter your email and we'll send you a reset link.</p>
                </div>
                
                {message ? (
                    <p className="text-center p-4 bg-green-100 text-green-800 rounded-md">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={labelStyles}>Email Address</label>
                            <input
                                id="email" name="email" type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                        {error && <p className="text-sm text-center text-red-600">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold text-white transition duration-300 bg-[var(--brand-gold)] rounded-md hover:bg-opacity-80 disabled:bg-gray-400">
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
                 <div className="text-sm text-center text-gray-500">
                    <Link href="/login" className="font-semibold text-brand-navy hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}