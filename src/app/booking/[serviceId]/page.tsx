import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import BookingForm from '@/components/BookingForm';
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

export default async function BookingPage({ params }: { params: Promise<{ serviceId: string }> }) {
    const { serviceId } = await params;
    const service = await getService(serviceId);

    if (!service) {
        return <div className="text-center py-20">Service not found</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Complete Your Booking</h1>
            <BookingForm service={service} />
        </div>
    );
}
