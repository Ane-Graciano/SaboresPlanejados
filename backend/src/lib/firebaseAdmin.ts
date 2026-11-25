import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        projectId: 'sabores-planejados',
      });

export const adminAuth = getAuth(firebaseApp);