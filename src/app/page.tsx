import Link from 'next/link';
import type { Service } from '@/types';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getServices(): Promise<Service[]> {
    // Option 1: Fetch via API (requires absolute URL)
    // Option 2: Direct DB call (Better for Server Components)
    // I'll use Direct DB call for stability, as localhost fetches can be flaky in some envs without proper setup.
    // But to strictly verify the API works as per user request, I should arguably use it.
    // However, for production App Router, direct data fetching is recommended.
    // I will compromise: Use direct DB for reliable rendering, but keep API for client interactions if needed.
    // Actually, I'll use the API Logic imported? No, `getDatabase` is simpler.

    // WAIT, the `api/services/route.ts` is simple. I can duplicate the fetch logic or import a shared function.
    // I'll import `getDatabase`.

    const { getDatabase } = await import("@/lib/mongodb");
    const db = await getDatabase();
    const services = await db.collection('services').find({}).toArray();
    // Serialize _id
    return services.map(service => ({
        _id: service._id.toString(),
        title: service.title as string,
        description: service.description as string,
        imageUrl: service.imageUrl as string | undefined,
        chargePerHour: service.chargePerHour as number,
        features: service.features as string[] | undefined,
        category: service.category as string | undefined,
        createdAt: service.createdAt as Date | undefined,
        updatedAt: service.updatedAt as Date | undefined,
    }));
}

export default async function Home() {
    const services = await getServices();

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 dark:from-purple-900 dark:via-purple-800 dark:to-purple-950 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block">Trusted Care for</span>
                            <span className="block text-purple-200 dark:text-purple-300 mt-2">Your Loved Ones</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-purple-100 dark:text-purple-200 leading-relaxed">
                            Professional babysitting, elderly care, and specialized medical support at your doorstep. 
                            Experience peace of mind with our trusted caregivers.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#services"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 dark:bg-purple-100 dark:text-purple-900 dark:hover:bg-purple-200 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Explore Services
                            </a>
                            <a
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-purple-700 dark:hover:bg-purple-800 dark:hover:text-purple-100 transition-all transform hover:scale-105"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                    
                    {/* Feature Highlights */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                            <div className="text-3xl mb-3">👶</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Baby Care</h3>
                            <p className="text-purple-100 dark:text-purple-200 text-sm">
                                Experienced caregivers for your little ones
                            </p>
                        </div>
                        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                            <div className="text-3xl mb-3">👴</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Elderly Care</h3>
                            <p className="text-purple-100 dark:text-purple-200 text-sm">
                                Compassionate support for seniors
                            </p>
                        </div>
                        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                            <div className="text-3xl mb-3">🏥</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Medical Support</h3>
                            <p className="text-purple-100 dark:text-purple-200 text-sm">
                                Specialized healthcare assistance
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Our Services</h2>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                    {services.map((service: Service) => (
                        <div key={service._id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transform hover:-translate-y-1">
                            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
                                {/* Placeholder or Image */}
                                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
                                    {service.imageUrl ? (
                                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    ) : (
                                        <div className="text-4xl">🏥</div>
                                    )}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    <Link href={`/service/${service._id}`}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {service.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">{service.category}</p>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{service.description}</p>
                                <p className="mt-4 text-lg font-bold text-purple-600 dark:text-purple-400">${service.chargePerHour} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ hour</span></p>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No services found. <span className="text-xs">(Admin needs to add services)</span>
                    </div>
                )}
            </div>
        </div>
    );
}
