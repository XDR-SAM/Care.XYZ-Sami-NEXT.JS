import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function checkAdmin(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return false;
    const token = authHeader.split('Bearer ')[1];
    try {
        const decoded = await adminAuth.verifyIdToken(token);
        const db = await getDatabase();
        const user = await db.collection('users').findOne({ uid: decoded.uid });
        return user?.role === 'admin';
    } catch {
        return false;
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;
    const data = await request.json();

    // Remove _id from data if present
    delete data._id;

    const db = await getDatabase();
    await db.collection('services').updateOne({ _id: new ObjectId(id) }, { $set: data });

    return NextResponse.json({ message: 'Service updated' });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await checkAdmin(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;

    const db = await getDatabase();
    await db.collection('services').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Service deleted' });
}
