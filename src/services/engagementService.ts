import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Comment, UserEngagement, EngagementSummary } from '../types';

// Content types
type ContentType = 'restaurants' | 'hotels' | 'markets';

// ==================== LIKES/DISLIKES ====================

/**
 * Toggle like for a content item
 * If user has disliked, remove dislike and add like
 * If user has already liked, remove like
 */
export async function toggleLike(
  contentType: ContentType,
  contentId: string,
  userId: string,
  displayName: string
): Promise<void> {
  const batch = writeBatch(db);

  const likeRef = doc(db, contentType, contentId, 'likes', userId);
  const dislikeRef = doc(db, contentType, contentId, 'dislikes', userId);
  const engagementRef = doc(db, contentType, contentId, 'engagement', 'summary');

  // Check current state
  const [likeSnap, dislikeSnap] = await Promise.all([
    getDoc(likeRef),
    getDoc(dislikeRef),
  ]);

  const hasLiked = likeSnap.exists();
  const hasDisliked = dislikeSnap.exists();

  if (hasLiked) {
    // Remove like
    batch.delete(likeRef);
    batch.set(engagementRef, {
      likesCount: increment(-1),
    }, { merge: true });
  } else {
    // Add like
    batch.set(likeRef, {
      userId,
      displayName,
      createdAt: serverTimestamp(),
    });
    batch.set(engagementRef, {
      likesCount: increment(1),
    }, { merge: true });

    // If user has disliked, remove dislike
    if (hasDisliked) {
      batch.delete(dislikeRef);
      batch.set(engagementRef, {
        dislikesCount: increment(-1),
      }, { merge: true });
    }
  }

  await batch.commit();
}

/**
 * Toggle dislike for a content item
 * If user has liked, remove like and add dislike
 * If user has already disliked, remove dislike
 */
export async function toggleDislike(
  contentType: ContentType,
  contentId: string,
  userId: string,
  displayName: string
): Promise<void> {
  const batch = writeBatch(db);

  const likeRef = doc(db, contentType, contentId, 'likes', userId);
  const dislikeRef = doc(db, contentType, contentId, 'dislikes', userId);
  const engagementRef = doc(db, contentType, contentId, 'engagement', 'summary');

  // Check current state
  const [likeSnap, dislikeSnap] = await Promise.all([
    getDoc(likeRef),
    getDoc(dislikeRef),
  ]);

  const hasLiked = likeSnap.exists();
  const hasDisliked = dislikeSnap.exists();

  if (hasDisliked) {
    // Remove dislike
    batch.delete(dislikeRef);
    batch.set(engagementRef, {
      dislikesCount: increment(-1),
    }, { merge: true });
  } else {
    // Add dislike
    batch.set(dislikeRef, {
      userId,
      displayName,
      createdAt: serverTimestamp(),
    });
    batch.set(engagementRef, {
      dislikesCount: increment(1),
    }, { merge: true });

    // If user has liked, remove like
    if (hasLiked) {
      batch.delete(likeRef);
      batch.set(engagementRef, {
        likesCount: increment(-1),
      }, { merge: true });
    }
  }

  await batch.commit();
}

/**
 * Get user's engagement status for a content item
 */
export async function getUserEngagement(
  contentType: ContentType,
  contentId: string,
  userId: string
): Promise<UserEngagement> {
  const likeRef = doc(db, contentType, contentId, 'likes', userId);
  const dislikeRef = doc(db, contentType, contentId, 'dislikes', userId);

  const [likeSnap, dislikeSnap] = await Promise.all([
    getDoc(likeRef),
    getDoc(dislikeRef),
  ]);

  return {
    hasLiked: likeSnap.exists(),
    hasDisliked: dislikeSnap.exists(),
  };
}

/**
 * Get engagement summary (counts) for a content item
 */
export async function getEngagementSummary(
  contentType: ContentType,
  contentId: string
): Promise<EngagementSummary> {
  const engagementRef = doc(db, contentType, contentId, 'engagement', 'summary');
  const engagementSnap = await getDoc(engagementRef);

  if (!engagementSnap.exists()) {
    return {
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
    };
  }

  const data = engagementSnap.data();
  return {
    likesCount: data.likesCount || 0,
    dislikesCount: data.dislikesCount || 0,
    commentsCount: data.commentsCount || 0,
  };
}

// ==================== COMMENTS ====================

/**
 * Add a comment to a content item
 */
export async function addComment(
  contentType: ContentType,
  contentId: string,
  userId: string,
  displayName: string,
  photoURL: string | undefined,
  text: string
): Promise<string> {
  const commentsRef = collection(db, contentType, contentId, 'comments');
  const engagementRef = doc(db, contentType, contentId, 'engagement', 'summary');

  const batch = writeBatch(db);

  // Add comment
  const commentRef = doc(commentsRef);
  batch.set(commentRef, {
    userId,
    displayName,
    photoURL: photoURL || '',
    text,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isEdited: false,
  });

  // Increment comment count
  batch.set(engagementRef, {
    commentsCount: increment(1),
  }, { merge: true });

  await batch.commit();

  return commentRef.id;
}

/**
 * Update a comment
 */
export async function updateComment(
  contentType: ContentType,
  contentId: string,
  commentId: string,
  newText: string,
  keepHistory: boolean = true
): Promise<void> {
  const commentRef = doc(db, contentType, contentId, 'comments', commentId);

  // Get current comment for edit history
  const commentSnap = await getDoc(commentRef);
  if (!commentSnap.exists()) {
    throw new Error('Comment not found');
  }

  const currentComment = commentSnap.data();
  const updateData: any = {
    text: newText,
    updatedAt: serverTimestamp(),
    isEdited: true,
  };

  // Add to edit history if enabled
  if (keepHistory && currentComment.text !== newText) {
    const editHistory = currentComment.editHistory || [];
    updateData.editHistory = [
      ...editHistory,
      {
        text: currentComment.text,
        editedAt: serverTimestamp(),
      },
    ];
  }

  await updateDoc(commentRef, updateData);
}

/**
 * Delete a comment
 */
export async function deleteComment(
  contentType: ContentType,
  contentId: string,
  commentId: string
): Promise<void> {
  const commentRef = doc(db, contentType, contentId, 'comments', commentId);
  const engagementRef = doc(db, contentType, contentId, 'engagement', 'summary');

  const batch = writeBatch(db);

  // Delete comment
  batch.delete(commentRef);

  // Decrement comment count
  batch.set(engagementRef, {
    commentsCount: increment(-1),
  }, { merge: true });

  await batch.commit();
}

/**
 * Get all comments for a content item
 */
export async function getComments(
  contentType: ContentType,
  contentId: string
): Promise<Comment[]> {
  const commentsRef = collection(db, contentType, contentId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      displayName: data.displayName,
      photoURL: data.photoURL,
      contentType,
      contentId,
      text: data.text,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
      isEdited: data.isEdited || false,
      editHistory: data.editHistory || [],
    } as Comment;
  });
}
