/**
 * PWA Utilities
 * Helper functions for Progressive Web App functionality
 */

/**
 * Check if the app is running as a PWA (installed)
 */
export function isPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if the browser supports PWA installation
 */
export function supportsPWA(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Check if the app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Show a notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options,
    });
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log('All caches cleared');
  }
}

/**
 * Get cache storage estimate
 */
export async function getStorageEstimate(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = (usage / quota) * 100;
    
    return {
      usage,
      quota,
      percentage,
    };
  }
  return null;
}

/**
 * Check if service worker is registered and active
 */
export async function checkServiceWorkerStatus(): Promise<{
  registered: boolean;
  active: boolean;
  waiting: boolean;
}> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      return {
        registered: true,
        active: !!registration.active,
        waiting: !!registration.waiting,
      };
    }
  }
  
  return {
    registered: false,
    active: false,
    waiting: false,
  };
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return await registration.unregister();
    }
  }
  return false;
}

/**
 * Force update the service worker
 */
export async function updateServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service worker update triggered');
    }
  }
}

/**
 * Share content using Web Share API
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }
  return false;
}

/**
 * Add to home screen instructions based on platform
 */
export function getInstallInstructions(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'Tap the Share button and then "Add to Home Screen"';
  } else if (/android/.test(ua)) {
    return 'Tap the menu button and then "Install App" or "Add to Home Screen"';
  } else {
    return 'Look for the install button in your browser\'s address bar';
  }
}

/**
 * Detect iOS device
 */
export function isIOS(): boolean {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}

/**
 * Detect Android device
 */
export function isAndroid(): boolean {
  return /android/.test(navigator.userAgent.toLowerCase());
}

/**
 * Get device type
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' | 'unknown' {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  } else if (/android/.test(ua)) {
    return 'android';
  } else if (!/mobile/.test(ua)) {
    return 'desktop';
  }
  
  return 'unknown';
}
