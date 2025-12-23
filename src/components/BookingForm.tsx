'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Service } from '@/types';

export default function BookingForm({ service }: { service: Service }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [duration, setDuration] = useState(1);
    const [location, setLocation] = useState({
        division: '',
        district: '',
        city: '',
        area: '',
        address: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Check auth and profile
    useEffect(() => {
        if (!loading && !user) {
            router.push(`/login?redirect=/booking/${service._id}`);
            return;
        }

        if (user) {
            // Check profile status
            user.getIdToken().then(token => {
                fetch('/api/auth/status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(r => r.json()).then(d => {
                    if (!d.profileComplete) {
                        toast.error('Please complete your profile to book');
                        router.push('/profile-complete');
                    }
                });
            });
        }
    }, [user, loading, router, service._id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceId: service._id,
                    duration,
                    location,
                    date: new Date()
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Booking failed');

            toast.success('Booking successful! Invoice sent.');
            router.push('/my-bookings');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const totalCost = (service.chargePerHour * duration).toFixed(2);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Book: {service.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Hourly Rate: ${service.chargePerHour}</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Hours)</label>
                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Division</label>
                            <input
                                type="text"
                                required
                                value={location.division}
                                onChange={(e) => setLocation({ ...location, division: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
                            <input
                                type="text"
                                required
                                value={location.district}
                                onChange={(e) => setLocation({ ...location, district: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                            <input
                                type="text"
                                required
                                value={location.city}
                                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area</label>
                            <input
                                type="text"
                                required
                                value={location.area}
                                onChange={(e) => setLocation({ ...location, area: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
                        <textarea
                            required
                            rows={3}
                            value={location.address}
                            onChange={(e) => setLocation({ ...location, address: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-900 dark:text-white font-medium">Total Cost:</span>
                            <span className="text-2xl font-bold text-indigo-600">${totalCost}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {submitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
