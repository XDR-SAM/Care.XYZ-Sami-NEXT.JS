'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, Clock as ClockIcon, AlertCircle } from 'lucide-react';

interface Booking {
    _id: string;
    serviceName: string;
    duration: number;
    location: {
        city: string;
        area: string;
        address: string;
    };
    totalCost: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    createdAt: string;
    bookingDate?: string;
    serviceId: string;
}

export default function UserDashboard() {
    const { user, loading, userRole } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user && userRole === 'admin') {
            router.push('/admin');
            return;
        }

        if (user) {
            user.getIdToken().then(token => {
                fetch('/api/bookings/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setBookings(data);
                        }
                    })
                    .catch(err => console.error('Error fetching bookings:', err))
                    .finally(() => setFetching(false));
            });
        }
    }, [user, loading, userRole, router]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'Completed':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'Cancelled':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'Pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        confirmed: bookings.filter(b => b.status === 'Confirmed').length,
        completed: bookings.filter(b => b.status === 'Completed').length,
    };

    if (loading || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your bookings and track their status</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.confirmed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Bookings</h2>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">You have no bookings yet.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Browse Services
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {booking.serviceName}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    <span>{booking.status}</span>
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {booking.bookingDate
                                                            ? format(new Date(booking.bookingDate), 'MMM dd, yyyy')
                                                            : booking.createdAt
                                                            ? format(new Date(booking.createdAt), 'MMM dd, yyyy')
                                                            : 'N/A'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm">{booking.duration} hours</span>
                                                </div>

                                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {booking.location?.city || 'N/A'}, {booking.location?.area || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            {booking.location?.address && (
                                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {booking.location.address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${booking.totalCost}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/service/${booking.serviceId}`}
                                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                                            >
                                                View Service
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

