import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Exposes a PWA "Install" action. Returns null until the browser fires
 * beforeinstallprompt (i.e. the app is installable on this device).
 */
export function usePwaInstall(): (() => void) | null {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt) return null;

  return () => {
    void (async () => {
      await prompt.prompt();
      await prompt.userChoice;
    })();
  };
}
