import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { setCorsHeaders } from '@/lib/cors';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

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

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}
