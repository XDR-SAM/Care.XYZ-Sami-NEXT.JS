import { ObjectId } from 'mongodb';

// Database types (with ObjectId)
export interface ServiceDocument {
    _id: ObjectId;
    title: string;
    description: string;
    imageUrl?: string;
    chargePerHour: number;
    features?: string[];
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BookingDocument {
    _id: ObjectId;
    userId: string;
    serviceId: string;
    scheduledDate: Date;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDocument {
    _id: ObjectId;
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

// Client-side types (with string _id)
export interface Service {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    chargePerHour: number;
    features?: string[];
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Booking {
    _id: string;
    userId: string;
    serviceId: string;
    scheduledDate: Date;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    _id: string;
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'user' | 'admin';
    createdAt: Date;
}
