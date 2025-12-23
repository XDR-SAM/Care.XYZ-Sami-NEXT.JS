import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await getDatabase();
        const services = await db.collection('services').find({}).toArray();
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Admin check
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Check if user is admin in DB
        const db = await getDatabase();
        const user = await db.collection('users').findOne({ uid: decodedToken.uid });

        // Allow if role is admin OR if we want to seed (maybe bypass for now? No, stick to requirements).
        // Prompt says: "Admin Dashboard... Add/Edit/Delete services".
        // Also "POST /api/admin/services - Create service (admin only)" in requirements list. 
        // Wait, the prompt lists `/api/admin/services` SEPARATELY from `/api/services`.
        // But RESTful typically uses `POST /api/services`. 
        // I will stick to the prompts "API Routes Required": `POST /api/admin/services`.
        // So `api/services` should overlap? Or `api/services` is just GET?
        // "GET /api/services - Get all services"
        // "POST /api/admin/services - Create service (admin only)"
        // Okay, I should split them as requested. 
        // This file `api/services/route.ts` should only have GET.
        // I will move POST to `api/admin/services/route.ts`.

        return NextResponse.json({ error: 'Use /api/admin/services to create' }, { status: 405 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
