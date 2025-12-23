import Link from 'next/link';
import type { Service } from '@/types';

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
            <div className="relative bg-indigo-600">
                <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Trusted Care for Your Loved Ones
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
                        Professional babysitting, elderly care, and specialized medical support at your doorstep.
                    </p>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Our Services</h2>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                    {services.map((service: Service) => (
                        <div key={service._id} className="group relative bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                {/* Placeholder or Image */}
                                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                                    {service.imageUrl ? <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" /> : 'No Image'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    <Link href={`/service/${service._id}`}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {service.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{service.category}</p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>
                                <p className="mt-4 text-lg font-bold text-indigo-600">${service.chargePerHour} <span className="text-sm font-normal text-gray-500">/ hour</span></p>
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
