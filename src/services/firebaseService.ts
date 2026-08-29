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
import { INITIAL_DONORS } from '../data/mockData';

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
 * Creates an order in Firestore with pending status (from public checkout)
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
 * Creates a new order directly from the Admin Panel with custom status
 */
export async function createAdminOrder(payload: Omit<Order, 'id' | 'timeAgo'>): Promise<string> {
  const ordersRef = collection(db, 'orders');
  const now = payload.timestamp || Date.now();

  const docRef = await addDoc(ordersRef, {
    ...payload,
    timestamp: now,
    confirmedAt: payload.status === 'confirmed' ? now : null,
  });

  // If created as confirmed, register in donors and increment campaign counter
  if (payload.status === 'confirmed') {
    try {
      const donorDocRef = doc(db, 'donors', docRef.id);
      await setDoc(donorDocRef, {
        name: payload.name,
        message: payload.message || '',
        itemSupported: payload.itemSupported || '',
        city: payload.city || 'Cartagena',
        timestamp: now,
        status: 'confirmed',
      });

      const campaignDocRef = doc(db, 'campaign', 'cartagena2026');
      await updateDoc(campaignDocRef, {
        currentCount: increment(1),
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Error syncing admin created donor:', e);
    }
  }

  return docRef.id;
}

/**
 * Saves full changes to an existing order (from Admin Edit Modal)
 */
export async function saveEditedOrder(
  orderId: string,
  updatedData: Partial<Order>,
  previousStatus: OrderStatus
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const newStatus = updatedData.status || previousStatus;

  await updateDoc(orderRef, {
    ...updatedData,
    confirmedAt: newStatus === 'confirmed' ? (updatedData.confirmedAt || Date.now()) : null,
  });

  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');
  const donorDocRef = doc(db, 'donors', orderId);

  // Case 1: Changed from non-confirmed -> confirmed
  if (newStatus === 'confirmed' && previousStatus !== 'confirmed') {
    try {
      await setDoc(donorDocRef, {
        name: updatedData.name || 'Solidario',
        message: updatedData.message || '',
        itemSupported: updatedData.itemSupported || '',
        city: updatedData.city || 'Cartagena',
        timestamp: updatedData.timestamp || Date.now(),
        status: 'confirmed',
      });

      await updateDoc(campaignDocRef, {
        currentCount: increment(1),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error creating donor on confirm:', e);
    }
  }

  // Case 2: Changed from confirmed -> non-confirmed
  else if (previousStatus === 'confirmed' && newStatus !== 'confirmed') {
    try {
      await deleteDoc(donorDocRef);
      await updateDoc(campaignDocRef, {
        currentCount: increment(-1),
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Error removing donor on unconfirm:', e);
    }
  }

  // Case 3: Remains confirmed, but name/message/city/itemSupported was edited
  else if (newStatus === 'confirmed' && previousStatus === 'confirmed') {
    try {
      await setDoc(
        donorDocRef,
        {
          name: updatedData.name,
          message: updatedData.message || '',
          itemSupported: updatedData.itemSupported || '',
          city: updatedData.city || 'Cartagena',
          status: 'confirmed',
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Error updating donor details:', e);
    }
  }
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
    async (snapshot) => {
      // If collection is empty, seed initial donors once
      if (snapshot.empty) {
        try {
          for (const d of INITIAL_DONORS) {
            await setDoc(doc(db, 'donors', d.id), {
              name: d.name,
              message: d.message || '',
              itemSupported: d.itemSupported || '',
              city: 'Cartagena',
              timestamp: d.timestamp || Date.now(),
              status: 'confirmed',
            });
          }
        } catch (e) {
          console.warn('Could not seed initial donors:', e);
        }
        onUpdate(INITIAL_DONORS);
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
          status: data.status || 'confirmed',
          timestamp,
          timeAgo: formatTimeAgo(timestamp),
        };
      });

      onUpdate(donors);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donors');
      // Graceful fallback to initial donors on error
      onUpdate(INITIAL_DONORS);
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to real-time Campaign stats from Firestore.
 * Calculates currentCount dynamically as the total sum of `quantity` across all items in all orders from the `orders` collection.
 */
export function subscribeToCampaign(
  onUpdate: (stats: { currentCount: number; totalCount: number }) => void
): () => void {
  const ordersRef = collection(db, 'orders');
  const campaignDocRef = doc(db, 'campaign', 'cartagena2026');

  let currentTotalTarget = 200;
  let latestCalculatedCount = 0;

  // Listen to campaign target doc (for configurable totalCount e.g. 200)
  const unsubCampaignDoc = onSnapshot(
    campaignDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const rawTotal = data.totalCount ?? data.total ?? data.metaTotal;
        const parsedTotal = typeof rawTotal === 'number' ? rawTotal : Number(rawTotal);
        if (!isNaN(parsedTotal) && parsedTotal > 0) {
          currentTotalTarget = parsedTotal;
        }
      }
      onUpdate({
        currentCount: latestCalculatedCount,
        totalCount: currentTotalTarget,
      });
    },
    (error) => {
      console.warn('Error reading campaign target doc:', error);
    }
  );

  // Listen to orders collection in real-time to compute sum of item quantities
  const unsubOrders = onSnapshot(
    ordersRef,
    async (snapshot) => {
      let totalSumQuantity = 0;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (Array.isArray(data.items) && data.items.length > 0) {
          for (const item of data.items) {
            const qty = typeof item?.quantity === 'number' ? item.quantity : Number(item?.quantity);
            totalSumQuantity += (!isNaN(qty) && qty > 0) ? qty : 1;
          }
        } else if (typeof data.quantity === 'number' && data.quantity > 0) {
          totalSumQuantity += data.quantity;
        } else {
          totalSumQuantity += 1;
        }
      });

      latestCalculatedCount = totalSumQuantity;

      // Sync computed count to campaign document for persistence
      try {
        await setDoc(
          campaignDocRef,
          {
            currentCount: totalSumQuantity,
            totalCount: currentTotalTarget,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Could not sync computed pieces count to campaign doc:', e);
      }

      onUpdate({
        currentCount: totalSumQuantity,
        totalCount: currentTotalTarget,
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      onUpdate({
        currentCount: latestCalculatedCount,
        totalCount: currentTotalTarget,
      });
    }
  );

  return () => {
    unsubCampaignDoc();
    unsubOrders();
  };
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
