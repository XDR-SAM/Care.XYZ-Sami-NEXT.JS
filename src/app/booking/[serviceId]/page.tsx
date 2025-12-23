import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import BookingForm from '@/components/BookingForm';

async function getService(id: string) {
    if (!ObjectId.isValid(id)) return null;
    const db = await getDatabase();
    const service = await db.collection('services').findOne({ _id: new ObjectId(id) });
    if (!service) return null;
    return {
        ...service,
        _id: service._id.toString()
    };
}

export default async function BookingPage({ params }: { params: { serviceId: string } }) {
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
