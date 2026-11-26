import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  collection, 
  getDocs, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig'; 

// 1. FAVORITOS
export async function getFavoritesFromCloud(userId: string): Promise<string[]> {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'favorites');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar favoritos da nuvem:', error);
    return [];
  }
}

export async function saveFavoritesToCloud(userId: string, recipeIds: string[]) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'favorites');
    await setDoc(docRef, { items: recipeIds }, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar favoritos na nuvem:', error);
  }
}

// 2. PLANEAMENTO SEMANAL (PLANNER)
export async function getPlannerFromCloud(userId: string) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'planner');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().schedule : null;
  } catch (error) {
    console.error('Erro ao buscar planeamento:', error);
    return null;
  }
}

export async function savePlannerToCloud(userId: string, scheduleData: any) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'planner');
    await setDoc(docRef, { schedule: scheduleData, updatedAt: Timestamp.now() }, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar planeamento:', error);
  }
}

// 3. LISTA DE COMPRAS
export async function getShoppingListFromCloud(userId: string) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'shoppingList');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().items : null;
  } catch (error) {
    console.error('Erro ao buscar lista de compras:', error);
    return null;
  }
}

export async function saveShoppingListToCloud(userId: string, items: any[]) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'shoppingList');
    await setDoc(docRef, { items, updatedAt: Timestamp.now() }, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar lista de compras:', error);
  }
}

// 4. HISTÓRICO (Visualizadas e Preparadas)
export async function addHistoryItem(userId: string, recipeId: string, tipo: 'VISUALIZADA' | 'PREPARADA') {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    await setDoc(doc(historyRef), {
      recipeId,
      tipo,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
  }
}

export async function getHistoryFromCloud(userId: string) {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    const querySnapshot = await getDocs(historyRef);
    const history: any[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return history;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}

export async function clearUserHistory(userId: string) {
  try {
    const historyRef = collection(db, 'users', userId, 'history');
    const querySnapshot = await getDocs(historyRef);
    const deletions = querySnapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletions);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

// --- DESPENSA ---
export async function getPantryFromCloud(userId: string): Promise<any[] | null> {
  try {
    const docRef = doc(db, `users/${userId}/data/pantry`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().itens || [];
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar despensa da nuvem:', error);
    return null;
  }
}

export async function savePantryToCloud(userId: string, itens: any[]): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/data/pantry`);
    await setDoc(docRef, { itens }, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar despensa na nuvem:', error);
  }
}

// --- PREFERÊNCIAS ALIMENTARES ---
export async function getPreferencesFromCloud(userId: string): Promise<any | null> {
  try {
    const docRef = doc(db, `users/${userId}/data/preferences`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar preferências da nuvem:', error);
    return null;
  }
}

export async function savePreferencesToCloud(userId: string, preferencias: any): Promise<void> {
  try {
    const docRef = doc(db, `users/${userId}/data/preferences`);
    await setDoc(docRef, preferencias, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar preferências na nuvem:', error);
  }
}