'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Moon, Sun, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { user, loading, userRole } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const handleDashboardClick = () => {
        if (userRole === 'admin') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-purple-100 dark:border-purple-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                                Care.xyz
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </Link>
                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        {/* Dashboard Button */}
                                        <button
                                            onClick={handleDashboardClick}
                                            className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span className="hidden sm:inline">Dashboard</span>
                                        </button>
                                        
                                        <Link href="/my-bookings" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            My Bookings
                                        </Link>
                                        
                                        {/* Profile Image */}
                                        <div className="flex items-center space-x-2">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="h-8 w-8 rounded-full border-2 border-purple-200 dark:border-purple-700"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Login
                                        </Link>
                                        <Link href="/register" className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                        
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
