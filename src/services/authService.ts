import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { User } from '../types';

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email,
      displayName,
      photoURL: user.photoURL || '',
    });

    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Update Firebase Auth profile with Google data
    if (user.displayName) {
      await updateProfile(user, {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user.uid, {
        email: user.email || '',
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
      });
    } else {
      // Update existing user document with latest Google info
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string): Promise<'user' | 'admin'> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      return userData.role || 'user';
    }
    return 'user';
  } catch (error) {
    console.error('Get user role error:', error);
    return 'user';
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
}

/**
 * Create user document in Firestore
 */
async function createUserDocument(
  uid: string,
  data: { email: string; displayName: string; photoURL: string }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: 'user',
      contributionPoints: 0,
      stats: {
        restaurantsSubmitted: 0,
        hotelsSubmitted: 0,
        marketsSubmitted: 0,
        travelGuidesCreated: 0,
        approvedSubmissions: 0,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Create user document error:', error);
    throw error;
  }
}
