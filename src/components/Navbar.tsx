'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Care.xyz</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        <Link href="/my-bookings" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                            My Bookings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                            Login
                                        </Link>
                                        <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
