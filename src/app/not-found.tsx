import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <h2 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-4">404</h2>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Page Not Found</h1>
            <p className="text-gray-500 mb-8 text-center max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors dark:bg-purple-500 dark:hover:bg-purple-600">
                Return Home
            </Link>
        </div>
    );
}
