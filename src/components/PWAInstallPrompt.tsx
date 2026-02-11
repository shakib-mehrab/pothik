import { useState, useEffect } from 'react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show prompt after a delay (optional)
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('PWA installed!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    
    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 p-4 shadow-lg z-50 bg-card border-primary">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-primary-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">Install Pothik App</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Get quick access to Bangladesh travel guide. Works offline!
          </p>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="flex-1"
            >
              Install
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDismiss}
            >
              Maybe Later
            </Button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
