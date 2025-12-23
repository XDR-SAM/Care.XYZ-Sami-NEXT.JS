'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'services'>('bookings');

    const [bookings, setBookings] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    // Service Form State
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceData, setServiceData] = useState({
        title: '', description: '', category: 'Baby Care', chargePerHour: '', imageUrl: '', features: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        // Check role? Ideally we check in API, but client redirection helps UX.
    }, [user, loading, router]);

    const fetchData = async () => {
        if (!user) return;
        const token = await user.getIdToken();

        // Fetch Bookings
        fetch('/api/admin/bookings', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => {
                if (res.status === 403) throw new Error('Not Admin');
                return res.json();
            })
            .then(data => setBookings(Array.isArray(data) ? data : []))
            .catch(err => {
                if (err.message === 'Not Admin') router.push('/');
            });

        // Fetch Services
        fetch('/api/services').then(res => res.json()).then(data => setServices(data));
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!user) return;
        const token = await user.getIdToken();
        try {
            await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            toast.success('Status updated');
            fetchData();
        } catch (e) { toast.error('Failed to update status'); }
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const token = await user.getIdToken();
        try {
            const payload = {
                ...serviceData,
                features: serviceData.features.split(',').map(f => f.trim())
            };
            const res = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Service Created');
            setShowServiceForm(false);
            setServiceData({ title: '', description: '', category: 'Baby Care', chargePerHour: '', imageUrl: '', features: '' });
            fetchData();
        } catch (e) { toast.error('Failed to create service'); }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        if (!user) return;
        const token = await user.getIdToken();
        await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        toast.success('Service Deleted');
        fetchData();
    };

    const handleInitAdmin = async () => {
        await fetch('/api/admin/init', { method: 'POST' });
        toast.success('Admin Init Triggered');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <button onClick={handleInitAdmin} className="text-xs text-gray-400 hover:text-gray-600">Init Admin</button>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`${activeTab === 'bookings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`${activeTab === 'services' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Services
                    </button>
                </nav>
            </div>

            {activeTab === 'bookings' ? (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.serviceName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{booking.userId.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${booking.totalCost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirm</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancel</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <button
                            onClick={() => setShowServiceForm(!showServiceForm)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            {showServiceForm ? 'Cancel' : 'Add New Service'}
                        </button>
                    </div>

                    {showServiceForm && (
                        <form onSubmit={handleServiceSubmit} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
                            <input required className="w-full p-2 border rounded" placeholder="Title" value={serviceData.title} onChange={e => setServiceData({ ...serviceData, title: e.target.value })} />
                            <textarea required className="w-full p-2 border rounded" placeholder="Description" value={serviceData.description} onChange={e => setServiceData({ ...serviceData, description: e.target.value })} />
                            <select className="w-full p-2 border rounded" value={serviceData.category} onChange={e => setServiceData({ ...serviceData, category: e.target.value })}>
                                <option value="Baby Care">Baby Care</option>
                                <option value="Elderly Care">Elderly Care</option>
                                <option value="Sick People Care">Sick People Care</option>
                            </select>
                            <input required type="number" className="w-full p-2 border rounded" placeholder="Charge Per Hour" value={serviceData.chargePerHour} onChange={e => setServiceData({ ...serviceData, chargePerHour: e.target.value })} />
                            <input className="w-full p-2 border rounded" placeholder="Image URL" value={serviceData.imageUrl} onChange={e => setServiceData({ ...serviceData, imageUrl: e.target.value })} />
                            <input className="w-full p-2 border rounded" placeholder="Features (comma separated)" value={serviceData.features} onChange={e => setServiceData({ ...serviceData, features: e.target.value })} />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Service</button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map(service => (
                            <div key={service._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow relative">
                                <button onClick={() => handleDeleteService(service._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">Delete</button>
                                <h3 className="font-bold">{service.title}</h3>
                                <p className="text-sm text-gray-500">{service.category}</p>
                                <p className="text-indigo-600 font-bold">${service.chargePerHour}/hr</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
