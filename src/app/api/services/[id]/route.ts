import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // await params in Next.js 15+ (16 logic)

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const db = await getDatabase();
        const service = await db.collection('services').findOne({ _id: new ObjectId(id) });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
