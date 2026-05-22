import React, { useEffect, useState } from "react";

interface ScannerQRCodeProps {
  onFechar: () => void;
  onSucessoScan?: () => void; // Atalho caso queira simular a leitura completando
}

export default function ScannerQRCode({
  onFechar,
  onSucessoScan,
}: ScannerQRCodeProps) {
  const [progresso, setProgresso] = useState(64);

  // Efeito opcional apenas para simular o carregamento oscilando sutilmente se desejado
  useEffect(() => {
    const interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          if (onSucessoScan) onSucessoScan();
          return 100;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onSucessoScan]);

  return (
    <div className="min-h-screen w-full bg-[#1A1613] text-white font-sans flex justify-center selection:bg-[#FFB800] selection:text-[#1A1613]">
      {/* Container Mobile PWA - Modo Escuro do Visual da Câmera */}
      <div className="w-full max-w-md min-h-screen bg-[#131110] flex flex-col justify-between p-6 relative overflow-hidden">
        {/* === HEADER DO SCANNER === */}
        <div className="flex justify-between items-start mt-4 z-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Escaneando QR Code
            </h2>
            <p className="text-xs font-medium text-gray-400">
              Aponte para o QR da barraca
            </p>
          </div>

          {/* Botão de Fechar X */}
          <button
            onClick={onFechar}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-lg hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Fechar Scanner"
          >
            ✕
          </button>
        </div>

        {/* === ÁREA CENTRAL: MIRA DA CÂMERA (VIEWFINDER) === */}
        <div className="flex-1 w-full flex items-center justify-center p-4 relative">
          {/* O Retângulo de Leitura */}
          <div className="w-full max-w-[290px] aspect-square border border-white/20 rounded-[32px] relative bg-black/30 backdrop-blur-xs shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* CANTOS GUIA DA MIRA (AMARELO CAJU) */}
            {/* Top-Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFB800] rounded-tl-[20px] -mt-[2px] -ml-[2px]" />
            {/* Top-Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFB800] rounded-tr-[20px] -mt-[2px] -mr-[2px]" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFB800] rounded-bl-[20px] -mb-[2px] -ml-[2px]" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFB800] rounded-br-[20px] -mb-[2px] -mr-[2px]" />

            {/* ÍCONE DE FOCO CENTRAL DA LENTE */}
            <div className="w-12 h-8 relative opacity-40 flex items-center justify-center">
              <div className="w-6 h-4 border-y border-x border-white rounded" />
              <div className="w-2 h-[2px] bg-white absolute" />
            </div>

            {/* LINHA DE LASER SCANNER ANIMADA */}
            <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent top-1/2 -translate-y-1/2 animate-laser-glow shadow-[0_0_12px_#FFB800]" />
          </div>
        </div>

        {/* === RODAPÉ: BARRA DE PROGRESSO DO SCAN === */}
        <div className="w-full space-y-3 mb-6 z-10 px-2">
          {/* A Barra de Carregamento Estilizada */}
          <div className="w-full h-2 bg-white/10 border border-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFB800] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>

          {/* Texto de Status */}
          <p className="text-center text-xs font-bold tracking-wide text-gray-400">
            Lendo código...{" "}
            <span className="text-white font-black ml-0.5">{progresso}%</span>
          </p>
        </div>
      </div>

      {/* Regra de animação keyframe para o laser do scanner */}
      <style>{`
        @keyframes laserGlow {
          0%, 100% { transform: translateY(-60px); opacity: 0.4; }
          50% { transform: translateY(60px); opacity: 1; }
        }
        .animate-laser-glow {
          animation: laserGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
