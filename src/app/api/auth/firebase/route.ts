import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from '@clerk/nextjs/server';
import { cors } from '@/lib/cors';

if (!getApps().length) {
  console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('Firebase Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log('Firebase Private Key:', process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not Set');

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
    cors(request as any, response as any);
    return response;
  }

  try {
    const token = await auth().createCustomToken(userId);
    const response = NextResponse.json({ token });
    cors(request as any, response as any);
    return response;
  } catch (error) {
    console.error('Error creating custom token:', error);
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    cors(request as any, response as any);
    return response;
  }
}

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  cors(req as any, response as any);
  return response;
}