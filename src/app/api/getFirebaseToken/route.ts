import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Assume this is your Firebase database instance
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'No user ID provided' }, { status: 400 });
  }

  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // User doesn't exist, create an empty entry
      await setDoc(userRef, { createdAt: new Date() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error checking/creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
