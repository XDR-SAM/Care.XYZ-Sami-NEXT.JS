import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, email, password, contact, nidNo } = await request.json();

        if (!name || !email || !password || !contact || !nidNo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDatabase();
        const usersCollection = db.collection('users');

        // Check if user already exists in DB
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Create user in Firebase Authentication
        let firebaseUser;
        try {
            firebaseUser = await adminAuth.createUser({
                email,
                password,
                displayName: name,
            });
        } catch (firebaseError: any) {
            if (firebaseError.code === 'auth/email-already-exists') {
                // If firebase user exists but mongo doesn't, we might want to fail or sync.
                return NextResponse.json({ error: 'Email already in use in Authentication system' }, { status: 409 });
            }
            throw firebaseError;
        }

        const newUser = {
            uid: firebaseUser.uid,
            name,
            email,
            nidNo,
            contact,
            role: 'user',
            profileComplete: true,
            createdAt: new Date(),
        };

        await usersCollection.insertOne(newUser);

        return NextResponse.json({ message: 'User created successfully', uid: firebaseUser.uid }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
