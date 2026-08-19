import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Donor } from '../types';

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${diffDays} d`;
}

// Initial seed donors in case Firestore is completely empty on first launch
const INITIAL_SEED_DONORS = [
  { name: 'Valentina M.', message: 'Orgullosa de mi tierra, fuerza Cartagena.', itemSupported: 'Camiseta Solidaria OSANELI (Talla M)', city: 'Cartagena', minutesAgo: 3 },
  { name: 'Carlos Andrés R.', message: 'Presente desde Bocagrande con el corazón.', itemSupported: 'Short Denim Solidario OSANELI (Talla L)', city: 'Cartagena', minutesAgo: 14 },
  { name: 'Mariana S.', message: 'Toda mi solidaridad con nuestra gente.', itemSupported: 'Camiseta Solidaria OSANELI (Talla S)', city: 'Cartagena', minutesAgo: 28 },
  { name: 'Felipe & Familia', message: 'Cada grano cuenta. Fuerza.', itemSupported: 'Camiseta Solidaria OSANELI (Talla XL)', city: 'Cartagena', minutesAgo: 45 },
  { name: 'Daniela K.', message: 'Unidos somos más fuertes.', itemSupported: 'Short Denim Solidario OSANELI (Talla M)', city: 'Cartagena', minutesAgo: 90 },
];

/**
 * Subscribes to real-time donors from Firestore.
 * If the collection is empty, seeds the initial donors.
 */
export function subscribeToDonors(onUpdate: (donors: Donor[]) => void): () => void {
  const donorsRef = collection(db, 'donors');
  const q = query(donorsRef, orderBy('timestamp', 'desc'), limit(30));

  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial donors to Firestore
        try {
          const now = Date.now();
          for (const item of INITIAL_SEED_DONORS) {
            await addDoc(donorsRef, {
              name: item.name,
              message: item.message,
              itemSupported: item.itemSupported,
              city: item.city,
              timestamp: now - item.minutesAgo * 60 * 1000,
            });
          }
        } catch (e) {
          console.warn('Could not auto-seed donors:', e);
        }
        return;
      }

      const donors: Donor[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        return {
          id: docSnap.id,
          name: data.name || 'Solidario',
          message: data.message || '',
          itemSupported: data.itemSupported || '',
          city: data.city || '',
          timestamp,
          timeAgo: formatTimeAgo(timestamp),
        };
      });

      onUpdate(donors);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donors');
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to real-time Campaign stats from Firestore.
 */
export function subscribeToCampaign(
  onUpdate: (stats: { currentCount: number; totalCount: number }) => void
): () => void {
  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');

  const unsubscribe = onSnapshot(
    campaignDocRef,
    async (docSnap) => {
      if (!docSnap.exists()) {
        try {
          await setDoc(campaignDocRef, {
            currentCount: 142,
            totalCount: 200,
            updatedAt: Date.now(),
          });
        } catch (e) {
          console.warn('Could not initialize campaign doc:', e);
        }
        onUpdate({ currentCount: 142, totalCount: 200 });
        return;
      }

      const data = docSnap.data();
      onUpdate({
        currentCount: typeof data.currentCount === 'number' ? data.currentCount : 142,
        totalCount: typeof data.totalCount === 'number' ? data.totalCount : 200,
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'campaign/cartagena2026');
    }
  );

  return unsubscribe;
}

/**
 * Saves a new donor/buyer action into Firestore and increments the real-time counter.
 */
export async function registerSolidarityDonor(payload: {
  name: string;
  message?: string;
  itemSupported?: string;
  city?: string;
}) {
  const donorsRef = collection(db, 'donors');
  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');

  try {
    // 1. Add Donor doc
    await addDoc(donorsRef, {
      name: payload.name.trim() || 'Solidario Anónimo',
      message: payload.message?.trim() || '',
      itemSupported: payload.itemSupported?.trim() || '',
      city: payload.city?.trim() || 'Cartagena',
      timestamp: Date.now(),
    });

    // 2. Increment live campaign counter
    try {
      const campSnap = await getDoc(campaignDocRef);
      if (campSnap.exists()) {
        await updateDoc(campaignDocRef, {
          currentCount: increment(1),
          updatedAt: Date.now(),
        });
      } else {
        await setDoc(campaignDocRef, {
          currentCount: 143,
          totalCount: 200,
          updatedAt: Date.now(),
        });
      }
    } catch (countErr) {
      console.warn('Could not increment campaign count:', countErr);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'donors');
    throw error;
  }
}
