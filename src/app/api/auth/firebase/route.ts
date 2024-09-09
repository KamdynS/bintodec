import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from '@clerk/nextjs/server';
import { setCorsHeaders } from '@/lib/cors';

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
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
    const token = await auth().createCustomToken(userId);
    const response = NextResponse.json({ token });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error('Error creating custom token:', error);
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}