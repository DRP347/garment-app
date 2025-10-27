"use client";

import { useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message + ' Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000); // Redirect after 3 seconds
            } else {
                setError(data.message);
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
                    <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
                </div>
                
                {message ? (
                    <p className="text-center p-4 bg-green-100 text-green-800 rounded-md">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className={labelStyles}>New Password</label>
                            <input
                                id="password" name="password" type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                         <div>
                            <label htmlFor="confirmPassword" className={labelStyles}>Confirm New Password</label>
                            <input
                                id="confirmPassword" name="confirmPassword" type="password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputStyles}
                            />
                        </div>
                        {error && <p className="text-sm text-center text-red-600">{error}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold text-white bg-[var(--brand-gold)] rounded-md hover:bg-opacity-80 disabled:bg-gray-400">
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}