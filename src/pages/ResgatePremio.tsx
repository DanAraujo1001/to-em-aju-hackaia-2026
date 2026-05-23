import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react"; // Importação corrigida e blindada!

interface ResgatePremioProps {
  onVoltar: () => void;
}

export default function ResgatePremio({ onVoltar }: ResgatePremioProps) {
  const [timer, setTimer] = useState(59);
  const [qrPayload, setQrPayload] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 1 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const payload = {
      tipo: "RESGATE_BRINDE",
      timestamp: Math.floor(Date.now() / 1000),
      hashSeguranca:
        "CAJU-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
    };
    setQrPayload(JSON.stringify(payload));
  }, [timer]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFA800] via-[#E65C00] to-[#C84B24] flex justify-center selection:bg-[#1A1613] selection:text-white">
      <div className="w-full max-w-md min-h-screen flex flex-col p-6 relative overflow-y-auto pb-10">
        {/* HEADER */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onVoltar}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-2xl"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-black text-white leading-none tracking-tight">
              Resgate do Prêmio
            </h2>
            <p className="text-xs text-white/80 font-medium mt-1">
              Apresente ao atendente
            </p>
          </div>
        </div>

        {/* PREVIEW DO PRÊMIO */}
        <div className="flex flex-col items-center mt-8 text-center">
          <div className="w-32 h-32 bg-[#FAF7F0] border-2 border-[#1A1613] rounded-2xl p-3 shadow-[4px_4px_0px_0px_#1A1613] mb-4 flex items-center justify-center relative">
            <span className="text-6xl">🥤</span>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-full border border-[#1A1613]">
              DISPONÍVEL
            </div>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight leading-tight">
            Copo oficial Circuito Caju
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-black text-[#1A1613] opacity-60 line-through">
              120
            </span>
            <span className="text-sm font-black text-white bg-[#1A1613] px-2 py-0.5 rounded-lg">
              100 pontos
            </span>
          </div>
        </div>

        {/* CONTAINER DO QR CODE COM A NOVA BIBLIOTECA */}
        <div className="mt-8 flex flex-col items-center">
          <div className="bg-white border-4 border-[#1A1613] rounded-[40px] p-8 shadow-[8px_8px_0px_0px_#1A1613] flex flex-col items-center w-full max-w-[280px]">
            {qrPayload ? (
              <div className="w-full aspect-square flex items-center justify-center">
                <QRCodeSVG
                  value={qrPayload}
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  fgColor="#1A1613"
                />
              </div>
            ) : (
              <div className="w-[180px] h-[180px] bg-gray-200 animate-pulse rounded-xl" />
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full text-white text-[11px] font-bold border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            QR válido por {timer}s - regenera automaticamente
          </div>
        </div>

        <div className="mt-10 bg-[#FFB800] border-2 border-[#1A1613] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#1A1613] flex flex-col gap-3 text-center">
          <p className="text-sm font-black text-[#1A1613] leading-tight">
            📍 Stand Oficial ao lado do Palco Luiz Gonzaga
          </p>
        </div>
      </div>
    </div>
  );
}
