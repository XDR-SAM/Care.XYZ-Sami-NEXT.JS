import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { sendBookingInvoice } from '@/lib/nodemailer';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const { serviceId, duration, location, date } = await request.json();

        if (!serviceId || !duration || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDatabase();

        // Check if user profile is complete (Double check server side)
        const user = await db.collection('users').findOne({ uid });
        if (!user || !user.profileComplete) {
            return NextResponse.json({ error: 'Profile incomplete' }, { status: 403 });
        }

        const service = await db.collection('services').findOne({ _id: new ObjectId(serviceId) });
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const totalCost = service.chargePerHour * Number(duration);

        const newBooking = {
            userId: uid,
            serviceId,
            serviceName: service.title,
            duration: Number(duration),
            location,
            totalCost,
            status: 'Pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            bookingDate: date // Optional, but good to have
        };

        const result = await db.collection('bookings').insertOne(newBooking);

        // Send Email
        // Use user.email from DB or decodedToken.email
        const userEmail = user.email || decodedToken.email;
        if (userEmail) {
            await sendBookingInvoice(userEmail, newBooking);
        }

        return NextResponse.json({ message: 'Booking created', bookingId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
