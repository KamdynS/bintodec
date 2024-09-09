import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { headers } from 'next/headers';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred' }, { status: 400 });
  }

  // Handle the webhook event
  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses, username, created_at } = evt.data;

    try {
      const userRef = adminDb.collection('users').doc(id);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        // User doesn't exist in Firestore, create a new document
        await userRef.set({
          id,
          email: email_addresses[0]?.email_address,
          username: username || '',
          createdAt: new Date(created_at),
        });
        console.log('User created in Firestore');
      } else {
        // User exists, update the document
        await userRef.set({
          email: email_addresses[0]?.email_address,
          username: username || '',
          updatedAt: new Date(),
        }, { merge: true });
        console.log('User updated in Firestore');
      }
    } catch (error) {
      console.error('Error handling user in Firestore:', error);
      return NextResponse.json({ error: 'Error handling user in Firestore' }, { status: 500 });
    }
  }
  else {
    console.log(`Unhandled webhook type: ${evt.type}`);
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  }

  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
}

export const dynamic = 'force-dynamic'