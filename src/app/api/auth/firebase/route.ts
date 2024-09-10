import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from '@clerk/nextjs/server';
import { setCorsHeaders } from '@/lib/cors';

if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set');
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error; // This will prevent the app from starting if Firebase init fails
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    setCorsHeaders(response);
    return response;
  }

  try {
    const token = await adminAuth.createCustomToken(userId);
    const response = NextResponse.json({ token });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error('Error creating custom token:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    const response = NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    setCorsHeaders(response);
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}