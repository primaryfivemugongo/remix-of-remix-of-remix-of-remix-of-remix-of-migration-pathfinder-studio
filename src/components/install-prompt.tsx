import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { BROWSING_KEY, COOKIE_CLOSED_EVENT, INSTALL_DELAY_MS, INSTALLED_KEY, isInstalled, readPreference, rememberInstalled, supportsManualInstall } from '@/lib/app-installation';

const BLOCK_KEY = "ft-install-blocked";
const SNOOZE_KEY = "ft-install-snooze-until";
const SNOOZE_DAYS = 3;
const EXIT_MS = 420;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showManualHint, setShowManualHint] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isInstalled()) { rememberInstalled(); return; }
    let elapsed = 0;
    try { elapsed = Math.max(0, Math.min(INSTALL_DELAY_MS, Number(sessionStorage.getItem(BROWSING_KEY)) || 0)); } catch { /* no storage */ }
    let visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    let timer: number | undefined;
    let completed = false;
    let cookieClosed = Boolean(readPreference('ft-cookie-consent'));
    const saveTime = () => {
      if (visibleSince !== null) elapsed = Math.min(INSTALL_DELAY_MS, elapsed + Date.now() - visibleSince);
      visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
      try { sessionStorage.setItem(BROWSING_KEY, String(elapsed)); } catch { /* no storage */ }
    };
    const check = () => {
      window.clearTimeout(timer);
      saveTime();
      if (completed || isInstalled()) return;
      if (document.visibilityState !== 'visible') return;
      if (elapsed < INSTALL_DELAY_MS) {
        timer = window.setTimeout(check, INSTALL_DELAY_MS - elapsed);
        return;
      }
      if (!cookieClosed || readPreference(BLOCK_KEY)) return;
      if (Date.now() < Number(readPreference(SNOOZE_KEY) || 0)) return;
      // Chromium exposes the offer only when eligible; iOS Safari uses manual installation.
      if (!deferredPrompt.current && !supportsManualInstall()) return;
      setOpen(true);
    };
    const onInstalled = () => {
      completed = true;
      rememberInstalled();
      deferredPrompt.current = null;
      window.clearTimeout(timer);
      setOpen(false);
    };
    const onCookieClosed = () => { cookieClosed = true; check(); };
    const onStorage = (event: StorageEvent) => { if (event.key === INSTALLED_KEY && event.newValue === '1') onInstalled(); };
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const onDisplayMode = () => { if (isInstalled()) onInstalled(); };

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      check();
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener(COOKIE_CLOSED_EVENT, onCookieClosed);
    window.addEventListener('storage', onStorage);
    window.addEventListener('pagehide', saveTime);
    document.addEventListener('visibilitychange', check);
    displayMode.addEventListener('change', onDisplayMode);
    check();

    return () => {
      saveTime();
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener(COOKIE_CLOSED_EVENT, onCookieClosed);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pagehide', saveTime);
      document.removeEventListener('visibilitychange', check);
      displayMode.removeEventListener('change', onDisplayMode);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); remindLater(); }
      if (event.key !== 'Tab') return;
      const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      const first = buttons?.[0];
      const last = buttons?.[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); if (previous instanceof HTMLElement) previous.focus(); };
  }, [open]);

  const close = () => {
    setLeaving(true);
    window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, EXIT_MS);
  };

  const installNow = async () => {
    const promptEvent = deferredPrompt.current;
    if (promptEvent) {
      setInstalling(true);
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        deferredPrompt.current = null;
        if (outcome === "accepted") {
          rememberInstalled();
          close();
        } else {
          remindLater();
        }
      } catch {
        setShowManualHint(true);
      } finally {
        setInstalling(false);
      }
      return;
    }
    // No native prompt available (e.g. iPhone/iPad) — show manual steps.
    setShowManualHint(true);
  };

  const remindLater = () => {
    try {
      window.localStorage.setItem(
        SNOOZE_KEY,
        String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000),
      );
    } catch {
      /* ignore */
    }
    close();
  };

  const notInterested = () => {
    try {
      window.localStorage.setItem(BLOCK_KEY, "1");
    } catch {
      /* ignore */
    }
    close();
  };

  if (!open) return null;

  return (
    <div
      className={`ftp-backdrop ${leaving ? "popup-fade-out" : "popup-fade-in"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-app-title"
      aria-describedby="install-app-description"
      ref={dialogRef}
    >
      <div className={`ftp-card ftp-install ${leaving ? "popup-slide-down" : "popup-slide-up"}`}>
        <div className="ftp-badge" aria-hidden>
          <Download className="popup-bob" width={44} height={44} strokeWidth={2.6} />
        </div>
        <Button variant="source" size="source" type="button" onClick={remindLater} aria-label="Close" className="ftp-close">
          <X width={16} height={16} />
        </Button>
        <h2 id="install-app-title" className="ftp-title">Install the Fresh App</h2>
        <div className="ftp-appchip">
          <img src="/icons/icon-192.png?v=white-logo" alt="Fresh App logo" width={42} height={42} />
          <div>
            <b className="ftp-appname">Fresh App</b>
            <span>Fresh Teacher&apos;s Platform</span>
          </div>
        </div>
        <p className="ftp-text" id="install-app-description">
          Easily access Fresh Teacher&apos;s Platform anytime when you install the Fresh App on your
          device — lesson notes, schemes of work and past papers are just one tap away.
        </p>
        {showManualHint && (
          <p className="ftp-hint">
            On iPhone or iPad: tap the Share button, then &quot;Add to Home Screen&quot;. On Android:
            open the browser menu and choose &quot;Install app&quot; or &quot;Add to Home screen&quot;.
          </p>
        )}
        <div className="ftp-actions">
          <Button variant="source" size="source" type="button" disabled={installing} onClick={installNow} className="ftp-btn ftp-install-solid">
            {installing ? 'Installing…' : 'Install now'}
          </Button>
          <Button variant="source" size="source" type="button" onClick={remindLater} className="ftp-btn ftp-install-outline">
            Remind me later
          </Button>
          <Button variant="source" size="source" type="button" onClick={notInterested} className="ftp-btn ftp-ghost">
            Not Interested
          </Button>
        </div>
      </div>
    </div>
  );
}
