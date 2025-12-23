import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import type { Service } from '@/types';

async function getService(id: string): Promise<Service | null> {
    if (!ObjectId.isValid(id)) return null;
    const db = await getDatabase();
    const service = await db.collection('services').findOne({ _id: new ObjectId(id) });
    if (!service) return null;
    return {
        _id: service._id.toString(),
        title: service.title as string,
        description: service.description as string,
        imageUrl: service.imageUrl as string | undefined,
        chargePerHour: service.chargePerHour as number,
        features: service.features as string[] | undefined,
        category: service.category as string | undefined,
        createdAt: service.createdAt as Date | undefined,
        updatedAt: service.updatedAt as Date | undefined,
    };
}

export default async function ServiceDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const service = await getService(id);

    if (!service) {
        return <div className="text-center py-20 text-gray-500">Service not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                {/* Image */}
                <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                    {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>

                {/* Info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{service.title}</h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl text-indigo-600">${service.chargePerHour} <span className="text-lg text-gray-500">/ hour</span></p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="text-base text-gray-700 dark:text-gray-300 space-y-6">{service.description}</div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Features</h3>
                        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {service.features && service.features.map((feature: string, idx: number) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-10 flex">
                        <Link
                            href={`/booking/${service._id}`}
                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full"
                        >
                            Book This Service
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
