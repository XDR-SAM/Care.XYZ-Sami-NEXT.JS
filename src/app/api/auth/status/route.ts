import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ uid });

        if (!user) {
            // User logged in via Firebase (e.g. Google) but not in DB yet
            return NextResponse.json({ exists: false, profileComplete: false });
        }

        return NextResponse.json({
            exists: true,
            profileComplete: user.profileComplete,
            role: user.role
        });

    } catch (error) {
        console.error('Auth status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
