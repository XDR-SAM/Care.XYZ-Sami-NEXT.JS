import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ uid: decodedToken.uid });

    if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await db.collection('bookings').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Booking status updated' });
}
