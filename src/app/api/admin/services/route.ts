import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ uid: decodedToken.uid });

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
        }

        const { title, description, category, chargePerHour, imageUrl, features } = await request.json();

        if (!title || !description || !category || !chargePerHour) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newService = {
            title,
            description,
            category,
            chargePerHour: Number(chargePerHour),
            imageUrl,
            features: features || [],
            createdAt: new Date()
        };

        const result = await db.collection('services').insertOne(newService);

        return NextResponse.json({ message: 'Service created', serviceId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Create service error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
