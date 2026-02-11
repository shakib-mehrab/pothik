import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Button } from '../app/components/ui/button';
import { X, Download, RefreshCw, WifiOff } from 'lucide-react';

export function PWAPrompt() {
  const { isInstallable, isOnline, updateAvailable, installApp, updateApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    // Show install prompt after 3 seconds if installable
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  useEffect(() => {
    // Show update prompt when update is available
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  useEffect(() => {
    // Show offline indicator
    if (!isOnline) {
      setShowOfflineIndicator(true);
    } else {
      setShowOfflineIndicator(false);
    }
  }, [isOnline]);

  const handleInstall = async () => {
    await installApp();
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
  };

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-card border border-border rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  ইনস্টল করুন Pathik
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  আপনার ডিভাইসে ইনস্টল করে আরো ভালো অভিজ্ঞতা পান
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="flex-1"
                  >
                    ইনস্টল করুন
                  </Button>
                  <Button
                    onClick={() => setShowInstallPrompt(false)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    পরে
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1">
                  নতুন আপডেট উপলব্ধ
                </h3>
                <p className="text-xs opacity-90 mb-3">
                  নতুন ফিচার এবং উন্নতির জন্য আপডেট করুন
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                  >
                    আপডেট করুন
                  </Button>
                  <Button
                    onClick={() => setShowUpdatePrompt(false)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    পরে
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                aria-label="Close update prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {showOfflineIndicator && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm">
              <WifiOff className="w-4 h-4" />
              <span>আপনি অফলাইন আছেন - সংরক্ষিত কন্টেন্ট দেখানো হচ্ছে</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
