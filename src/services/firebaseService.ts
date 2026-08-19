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
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Donor, Order, OrderStatus } from '../types';

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

/**
 * Creates an order in Firestore with pending status
 */
export async function createOrder(payload: Omit<Order, 'id' | 'timestamp' | 'status' | 'timeAgo'>): Promise<string> {
  const ordersRef = collection(db, 'orders');
  const now = Date.now();

  const docRef = await addDoc(ordersRef, {
    ...payload,
    status: 'pending',
    timestamp: now,
  });

  return docRef.id;
}

/**
 * Subscribes to all orders in real-time (for Admin panel)
 */
export function subscribeToOrders(onUpdate: (orders: Order[]) => void): () => void {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('timestamp', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        return {
          id: docSnap.id,
          name: data.name || 'Comprador',
          docType: data.docType || 'CC',
          docNumber: data.docNumber || '',
          phoneNumber: data.phoneNumber || '',
          city: data.city || 'Cartagena',
          address: data.address || '',
          message: data.message || '',
          itemSupported: data.itemSupported || '',
          items: data.items || [],
          totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
          status: (data.status as OrderStatus) || 'pending',
          timestamp,
          timeAgo: formatTimeAgo(timestamp),
          confirmedAt: data.confirmedAt,
        };
      });
      onUpdate(orders);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  );

  return unsubscribe;
}

/**
 * Updates order status (pending, confirmed, rejected)
 * When confirmed, also registers in donors collection and increments campaign counter.
 */
export async function updateOrderStatus(order: Order, newStatus: OrderStatus): Promise<void> {
  const orderRef = doc(db, 'orders', order.id);
  const previousStatus = order.status;

  await updateDoc(orderRef, {
    status: newStatus,
    confirmedAt: newStatus === 'confirmed' ? Date.now() : null,
  });

  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');
  const donorDocRef = doc(db, 'donors', order.id);

  // If newly confirmed, add to donors and increment campaign count
  if (newStatus === 'confirmed' && previousStatus !== 'confirmed') {
    try {
      await setDoc(donorDocRef, {
        name: order.name,
        message: order.message || '',
        itemSupported: order.itemSupported || '',
        city: order.city || 'Cartagena',
        timestamp: Date.now(),
        status: 'confirmed',
      });

      await updateDoc(campaignDocRef, {
        currentCount: increment(1),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error syncing confirmed donor:', e);
    }
  }

  // If unconfirmed from previously confirmed, remove donor and decrement
  if (previousStatus === 'confirmed' && newStatus !== 'confirmed') {
    try {
      await deleteDoc(donorDocRef);
      await updateDoc(campaignDocRef, {
        currentCount: increment(-1),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error reverting confirmed donor:', e);
    }
  }
}

/**
 * Deletes an order
 */
export async function deleteOrder(orderId: string, wasConfirmed: boolean): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);

  if (wasConfirmed) {
    try {
      const donorDocRef = doc(db, 'donors', orderId);
      await deleteDoc(donorDocRef);

      const campaignDocRef = doc(db, 'campaign', 'cartagena2026');
      await updateDoc(campaignDocRef, {
        currentCount: increment(-1),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error cleaning up deleted donor:', e);
    }
  }
}

/**
 * Subscribes to real-time confirmed donors from Firestore for public feed.
 */
export function subscribeToDonors(onUpdate: (donors: Donor[]) => void): () => void {
  const donorsRef = collection(db, 'donors');
  const q = query(donorsRef, orderBy('timestamp', 'desc'), limit(30));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const donors: Donor[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const timestamp = typeof data.timestamp === 'number' ? data.timestamp : Date.now();
        return {
          id: docSnap.id,
          name: data.name || 'Solidario',
          message: data.message || '',
          itemSupported: data.itemSupported || '',
          city: data.city || '',
          status: data.status || 'confirmed',
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
            currentCount: 0,
            totalCount: 200,
            updatedAt: Date.now(),
          });
        } catch (e) {
          console.warn('Could not initialize campaign doc:', e);
        }
        onUpdate({ currentCount: 0, totalCount: 200 });
        return;
      }

      const data = docSnap.data();
      onUpdate({
        currentCount: typeof data.currentCount === 'number' ? data.currentCount : 0,
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
 * Updates campaign counter manually from admin
 */
export async function updateCampaignStats(currentCount: number, totalCount: number): Promise<void> {
  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');
  await setDoc(
    campaignDocRef,
    {
      currentCount,
      totalCount,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

/**
 * Verifies admin credentials in Firestore (email: admin@osaneli.com, pass: 0s4n3l1)
 */
export async function verifyAdminAuth(emailInput: string, passwordInput: string): Promise<boolean> {
  const adminDocRef = doc(db, 'admins', 'primary_admin');
  const snap = await getDoc(adminDocRef);

  if (!snap.exists()) {
    // Initialize default admin document
    await setDoc(adminDocRef, {
      email: 'admin@osaneli.com',
      password: '0s4n3l1',
      role: 'superadmin',
      createdAt: Date.now(),
    });
    return emailInput.trim().toLowerCase() === 'admin@osaneli.com' && passwordInput === '0s4n3l1';
  }

  const data = snap.data();
  return (
    emailInput.trim().toLowerCase() === (data.email || 'admin@osaneli.com').toLowerCase() &&
    passwordInput === (data.password || '0s4n3l1')
  );
}
