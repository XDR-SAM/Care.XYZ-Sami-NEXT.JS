import { getDatabase } from '@/lib/mongodb';
import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const db = await getDatabase();
        const usersCollection = db.collection('users');

        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
        }

        const existingAdmin = await usersCollection.findOne({ email: adminEmail });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists' });
        }

        // Create in Firebase
        let uid;
        try {
            const userRecord = await adminAuth.getUserByEmail(adminEmail);
            uid = userRecord.uid;
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                const newUser = await adminAuth.createUser({
                    email: adminEmail,
                    password: adminPassword,
                    displayName: 'Super Admin',
                });
                uid = newUser.uid;
            } else {
                throw e;
            }
        }

        // Create in Mongo
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = {
            uid,
            email: adminEmail,
            password: hashedPassword, // Store just in case, though Firebase handles auth
            role: 'admin',
            name: 'Super Admin',
            profileComplete: true,
            createdAt: new Date()
        };

        // Check if mongo user exists using uid (update if so)
        await usersCollection.updateOne({ email: adminEmail }, { $set: newAdmin }, { upsert: true });

        return NextResponse.json({ message: 'Admin initialized successfully' });

    } catch (error: any) {
        console.error('Admin init error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
