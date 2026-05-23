// src/components/InstallBanner.tsx
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se já está instalado como PWA
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (isStandalone) return;

    // Detecta iOS (Safari não suporta beforeinstallprompt)
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    if (ios) {
      setIsVisible(true);
      return;
    }

    // Captura o evento de instalação no Android/Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 animate-slide-up">
      <div className="bg-[#FFB800] border-2 border-[#1A1613] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1A1613] flex flex-col gap-3">
        {/* Header do Banner */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-b from-[#FFA800] to-[#E65C00] border-2 border-[#1A1613] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1613]">
              <span className="text-2xl">🥭</span>
            </div>
            <div>
              <p className="font-black text-sm text-[#1A1613] leading-tight">
                Instalar Circuito Caju
              </p>
              <p className="text-[11px] font-medium text-[#1A1613]/70">
                Acesso rápido na sua tela inicial
              </p>
            </div>
          </div>

          {/* Botão de fechar */}
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-[#1A1613]/10 flex items-center justify-center text-[#1A1613] font-black text-xs cursor-pointer hover:bg-[#1A1613]/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Instrução específica para iOS */}
        {isIOS ? (
          <div className="bg-white/60 border border-[#1A1613]/20 rounded-xl p-3 text-xs font-medium text-[#1A1613] text-center leading-relaxed">
            Toque em <span className="font-black">Compartilhar (⎙)</span> e
            depois em{" "}
            <span className="font-black">"Adicionar à Tela de Início"</span>
          </div>
        ) : (
          // Botão de instalação para Android/Desktop
          <button
            onClick={handleInstall}
            className="w-full h-11 bg-[#C84B24] hover:bg-[#b03f1d] text-white font-black text-sm border-2 border-[#1A1613] rounded-xl shadow-[3px_3px_0px_0px_#1A1613] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>📲</span> Adicionar à tela inicial
          </button>
        )}
      </div>
    </div>
  );
}
