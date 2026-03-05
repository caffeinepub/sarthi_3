import { Download, Smartphone, X } from "lucide-react";
import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export default function PWAInstallBanner() {
  const {
    isInstallable,
    isStandalone,
    isDismissed,
    promptInstall,
    dismissPrompt,
  } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Don't show if: already installed, dismissed, not installable, or hidden
  if (isStandalone || isDismissed || !isInstallable || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    const accepted = await promptInstall();
    setIsInstalling(false);
    if (accepted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up"
      role="banner"
      aria-label="Install Sarthi app"
    >
      <div className="bg-card border border-teal/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Teal accent bar at top */}
        <div className="h-1 w-full bg-gradient-to-r from-teal to-teal-dark" />

        <div className="p-4 flex items-center gap-4">
          {/* App icon */}
          <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md">
            <img
              src="/assets/generated/sarthi-icon-192.dim_192x192.png"
              alt="Sarthi"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Smartphone className="h-3.5 w-3.5 text-teal shrink-0" />
              <p className="font-heading font-bold text-foreground text-sm">
                Install Sarthi
              </p>
            </div>
            <p className="text-muted-foreground text-xs leading-snug">
              Add to home screen for quick access — works offline too!
            </p>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Not Now
          </button>
          <button
            type="button"
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-teal to-teal-dark text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isInstalling ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Install App
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
