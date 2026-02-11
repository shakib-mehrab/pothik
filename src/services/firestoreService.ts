import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Restaurant,
  Hotel,
  Market,
  TravelGuide,
  Tour,
  RestaurantFormData,
  HotelFormData,
  MarketFormData,
} from '../types';
import { updateLeaderboardForApproval } from './leaderboardService';

// ==================== Restaurants ====================

export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const q = query(
      collection(db, 'restaurants'),
      where('status', '==', 'approved'),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Restaurant);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

export async function submitRestaurant(
  data: RestaurantFormData,
  userId: string,
  displayName?: string,
  isAdmin?: boolean
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'restaurants'), {
      ...data,
      status: isAdmin ? 'approved' : 'pending',
      submittedBy: userId,
      submittedByName: displayName || 'Anonymous',
      submittedAt: serverTimestamp(),
      reviewedBy: isAdmin ? userId : undefined,
      reviewedAt: isAdmin ? serverTimestamp() : undefined,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    
    // Update leaderboard if admin auto-approved
    if (isAdmin) {
      await updateLeaderboardForApproval(userId, 'restaurants');
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting restaurant:', error);
    throw error;
  }
}

export async function updateRestaurant(
  id: string,
  data: RestaurantFormData
): Promise<void> {
  try {
    const docRef = doc(db, 'restaurants', id);
    await updateDoc(docRef, {
      ...data,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
}

export async function deleteRestaurant(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'restaurants', id));
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
}

// ==================== Hotels ====================

export async function getHotels(category?: 'hotel' | 'resort'): Promise<Hotel[]> {
  try {
    let q = query(
      collection(db, 'hotels'),
      where('status', '==', 'approved'),
      orderBy('submittedAt', 'desc')
    );

    if (category) {
      q = query(
        collection(db, 'hotels'),
        where('status', '==', 'approved'),
        where('category', '==', category),
        orderBy('submittedAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Hotel);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export async function submitHotel(
  data: HotelFormData,
  userId: string,
  category: 'hotel' | 'resort',
  documentsNeeded: string[],
  displayName?: string,
  isAdmin?: boolean
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'hotels'), {
      ...data,
      documentsNeeded,
      category,
      status: isAdmin ? 'approved' : 'pending',
      submittedBy: userId,
      submittedByName: displayName || 'Anonymous',
      submittedAt: serverTimestamp(),
      reviewedBy: isAdmin ? userId : undefined,
      reviewedAt: isAdmin ? serverTimestamp() : undefined,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    
    // Update leaderboard if admin auto-approved
    if (isAdmin) {
      await updateLeaderboardForApproval(userId, 'hotels');
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting hotel:', error);
    throw error;
  }
}

export async function updateHotel(
  id: string,
  data: HotelFormData,
  category: 'hotel' | 'resort',
  documentsNeeded: string[]
): Promise<void> {
  try {
    const docRef = doc(db, 'hotels', id);
    await updateDoc(docRef, {
      ...data,
      category,
      documentsNeeded,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    throw error;
  }
}

export async function deleteHotel(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'hotels', id));
  } catch (error) {
    console.error('Error deleting hotel:', error);
    throw error;
  }
}

// ==================== Markets ====================

export async function getMarkets(category?: string): Promise<Market[]> {
  try {
    let q = query(
      collection(db, 'markets'),
      where('status', '==', 'approved'),
      orderBy('submittedAt', 'desc')
    );

    if (category) {
      q = query(
        collection(db, 'markets'),
        where('status', '==', 'approved'),
        where('category', '==', category),
        orderBy('submittedAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Market);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
  }
}

export async function submitMarket(
  data: MarketFormData,
  userId: string,
  category: 'brands' | 'local' | 'budget' | 'others',
  specialty: string[],
  displayName?: string,
  isAdmin?: boolean
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'markets'), {
      ...data,
      specialty,
      category,
      status: isAdmin ? 'approved' : 'pending',
      submittedBy: userId,
      submittedByName: displayName || 'Anonymous',
      submittedAt: serverTimestamp(),
      reviewedBy: isAdmin ? userId : undefined,
      reviewedAt: isAdmin ? serverTimestamp() : undefined,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    
    // Update leaderboard if admin auto-approved
    if (isAdmin) {
      await updateLeaderboardForApproval(userId, 'markets');
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting market:', error);
    throw error;
  }
}

export async function updateMarket(
  id: string,
  data: MarketFormData,
  category: 'brands' | 'local' | 'budget' | 'others',
  specialty: string[]
): Promise<void> {
  try {
    const docRef = doc(db, 'markets', id);
    await updateDoc(docRef, {
      ...data,
      category,
      specialty,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
  } catch (error) {
    console.error('Error updating market:', error);
    throw error;
  }
}

export async function deleteMarket(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'markets', id));
  } catch (error) {
    console.error('Error deleting market:', error);
    throw error;
  }
}

// ==================== Travel Guides ====================

export async function getTravelGuides(): Promise<TravelGuide[]> {
  try {
    const q = query(
      collection(db, 'travelGuides'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TravelGuide);
  } catch (error) {
    console.error('Error fetching travel guides:', error);
    return [];
  }
}

// ==================== Tours ====================

export async function getUserTours(userId: string): Promise<Tour[]> {
  try {
    const q = query(
      collection(db, 'tours'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      } as Tour;
    });
  } catch (error) {
    console.error('Error fetching user tours:', error);
    return [];
  }
}

export async function getTour(tourId: string): Promise<Tour | null> {
  try {
    const docRef = doc(db, 'tours', tourId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      } as Tour;
    }
    return null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export async function createTour(tourData: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'tours'), {
      ...tourData,
      convertedToGuide: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
}

export async function updateTour(
  tourId: string,
  updates: Partial<Omit<Tour, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'tours', tourId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
}

export async function deleteTour(tourId: string): Promise<void> {
  try {
    const docRef = doc(db, 'tours', tourId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error;
  }
}

// ==================== Submissions (for admin) ====================

export async function getPendingSubmissions(type?: 'restaurant' | 'hotel' | 'market') {
  try {
    let q;
    if (type === 'restaurant') {
      q = query(
        collection(db, 'restaurants'),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
    } else if (type === 'hotel') {
      q = query(
        collection(db, 'hotels'),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
    } else if (type === 'market') {
      q = query(
        collection(db, 'markets'),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
    } else {
      // Get all pending submissions
      const [restaurants, hotels, markets] = await Promise.all([
        getPendingSubmissions('restaurant'),
        getPendingSubmissions('hotel'),
        getPendingSubmissions('market'),
      ]);
      return [...restaurants, ...hotels, ...markets];
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    return [];
  }
}
