import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
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
