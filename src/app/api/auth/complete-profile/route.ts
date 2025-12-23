import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Expect Authorization header with Firebase ID Token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const { nidNo, contact, name } = await request.json(); // Name might update too

        if (!nidNo || !contact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDatabase();
        const usersCollection = db.collection('users');

        // Upsert user or update. For Google login, user might not be in DB yet or just have minimal data?
        // "Google Login: Sign in with Google, check if user exists in DB. If missing NID/contact, set profileComplete: false"
        // So this endpoint is called when they fill the form.

        // Check if user exists first to determine if we update or create logic
        const existingUser = await usersCollection.findOne({ uid });

        const updateDoc = {
            $set: {
                uid,
                email: decodedToken.email,
                name: name || decodedToken.name || existingUser?.name,
                nidNo,
                contact,
                profileComplete: true,
                // Don't overwrite createdAt if exists
            },
            $setOnInsert: {
                role: 'user',
                createdAt: new Date()
            }
        };

        await usersCollection.updateOne({ uid }, updateDoc, { upsert: true });

        return NextResponse.json({ message: 'Profile completed successfully' });
    } catch (error) {
        console.error('Profile complete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
