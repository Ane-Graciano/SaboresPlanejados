import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC3j2Erpa9VLDvFDCeO0flq_17BkZgA9wk',
  authDomain: 'sabores-planejados.firebaseapp.com',
  projectId: 'sabores-planejados',
  storageBucket: 'sabores-planejados.firebasestorage.app',
  messagingSenderId: '328051519021',
  appId: '1:328051519021:web:f0118b29ca0f35c4d3d2a4',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);