import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { LeaderboardEntry } from '../types';

/**
 * Get top contributors from leaderboard
 */
export async function getTopContributors(limitCount: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL || '',
        totalPoints: data.totalPoints || 0,
        rank: index + 1,
        breakdown: data.breakdown || {
          restaurants: 0,
          hotels: 0,
          markets: 0,
          travelGuides: 0,
        },
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as LeaderboardEntry;
    });
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    return [];
  }
}

/**
 * Get user's rank and position on leaderboard
 */
export async function getUserRank(userId: string): Promise<{
  rank: number;
  entry: LeaderboardEntry | null;
}> {
  try {
    const userDoc = await getDoc(doc(db, 'leaderboard', userId));
    if (!userDoc.exists()) {
      return { rank: -1, entry: null };
    }

    const userData = userDoc.data();
    const userPoints = userData.totalPoints || 0;

    // Count users with more points to determine rank
    const q = query(
      collection(db, 'leaderboard'),
      where('totalPoints', '>', userPoints)
    );
    const snapshot = await getDocs(q);
    const rank = snapshot.size + 1;

    const entry: LeaderboardEntry = {
      uid: userId,
      displayName: userData.displayName || 'Anonymous',
      photoURL: userData.photoURL || '',
      totalPoints: userPoints,
      rank,
      breakdown: userData.breakdown || {
        restaurants: 0,
        hotels: 0,
        markets: 0,
        travelGuides: 0,
      },
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    };

    return { rank, entry };
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return { rank: -1, entry: null };
  }
}

/**
 * Get leaderboard with user highlighted
 */
export async function getLeaderboardWithUser(
  userId: string,
  limitCount: number = 50
): Promise<{
  leaderboard: LeaderboardEntry[];
  userRank: number;
  userEntry: LeaderboardEntry | null;
}> {
  try {
    const leaderboard = await getTopContributors(limitCount);
    const { rank, entry } = await getUserRank(userId);

    return {
      leaderboard,
      userRank: rank,
      userEntry: entry,
    };
  } catch (error) {
    console.error('Error fetching leaderboard with user:', error);
    return {
      leaderboard: [],
      userRank: -1,
      userEntry: null,
    };
  }
}

/**
 * Update leaderboard when a contribution is approved
 */
export async function updateLeaderboardForApproval(
  userId: string,
  collectionName: 'restaurants' | 'hotels' | 'markets' | 'travelGuides'
): Promise<void> {
  try {
    // Update user stats
    const userRef = doc(db, 'users', userId);
    const statField = `stats.${collectionName}Submitted`;
    await updateDoc(userRef, {
      [statField]: increment(1),
      'stats.approvedSubmissions': increment(1),
      contributionPoints: increment(10),
      updatedAt: serverTimestamp(),
    });

    // Update leaderboard
    const leaderboardRef = doc(db, 'leaderboard', userId);
    const leaderboardDoc = await getDoc(leaderboardRef);

    if (leaderboardDoc.exists()) {
      // Update existing leaderboard entry
      await updateDoc(leaderboardRef, {
        totalPoints: increment(10),
        [`breakdown.${collectionName}`]: increment(1),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new leaderboard entry
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await setDoc(leaderboardRef, {
          displayName: userData.displayName,
          photoURL: userData.photoURL || '',
          totalPoints: 10,
          breakdown: {
            restaurants: collectionName === 'restaurants' ? 1 : 0,
            hotels: collectionName === 'hotels' ? 1 : 0,
            markets: collectionName === 'markets' ? 1 : 0,
            travelGuides: collectionName === 'travelGuides' ? 1 : 0,
          },
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
}

/**
 * Get top contributors excluding admins
 */
export async function getTopContributorsExcludingAdmins(limitCount: number = 10): Promise<LeaderboardEntry[]> {
  try {
    // Fetch leaderboard entries (fetch more than needed to account for admins)
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('totalPoints', 'desc'),
      limit(limitCount * 3) // Fetch more than needed to ensure we have enough non-admin users
    );
    const snapshot = await getDocs(q);

    // Fetch all user UIDs from leaderboard
    const userIds = snapshot.docs.map(doc => doc.id);

    // Fetch user data to check roles
    const usersQuery = query(
      collection(db, 'users'),
      where('__name__', 'in', userIds.slice(0, 30)) // Firestore 'in' query limited to 30 items
    );
    const usersSnapshot = await getDocs(usersQuery);
    
    // Create a map of user roles
    const userRoles = new Map<string, string>();
    usersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      userRoles.set(doc.id, data.role || 'user');
    });

    // Filter out admins and map to LeaderboardEntry
    const nonAdminEntries: LeaderboardEntry[] = [];
    let rank = 1;
    
    for (const doc of snapshot.docs) {
      const role = userRoles.get(doc.id) || 'user';
      if (role !== 'admin' && nonAdminEntries.length < limitCount) {
        const data = doc.data();
        nonAdminEntries.push({
          uid: doc.id,
          displayName: data.displayName || 'Anonymous',
          photoURL: data.photoURL || '',
          totalPoints: data.totalPoints || 0,
          rank,
          breakdown: data.breakdown || {
            restaurants: 0,
            hotels: 0,
            markets: 0,
            travelGuides: 0,
          },
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
        rank++;
      }
    }

    return nonAdminEntries;
  } catch (error) {
    console.error('Error fetching top contributors excluding admins:', error);
    return [];
  }
}
