import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ResgatePremioProps {
  pontosDisponiveis: number;
  onVoltar: () => void;
  onConfirmarResgate: (custo: number) => void; // Nova propriedade
}

export default function ResgatePremio({
  pontosDisponiveis,
  onVoltar,
  onConfirmarResgate,
}: ResgatePremioProps) {
  const [qrPayload, setQrPayload] = useState("");

  // O custo do nosso copo fictício
  const custoPremio = 100;

  // Roda apenas UMA vez quando a tela abre (o array vazio [] no final garante isso)
  useEffect(() => {
    const payload = {
      tipo: "RESGATE_BRINDE",
      premio: "Copo Oficial Circuito Caju",
      custo: custoPremio,
      hashUnico:
        "CAJU-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    };
    setQrPayload(JSON.stringify(payload));
  }, []);

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
            <span
              className={`text-sm font-black text-white px-2 py-0.5 rounded-lg ${pontosDisponiveis >= custoPremio ? "bg-[#1A1613]" : "bg-red-600"}`}
            >
              {custoPremio} pontos
            </span>
          </div>
        </div>

        {/* CONTAINER DO QR CODE */}
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

          <div className="mt-4 text-white text-[11px] font-bold text-center">
            Código Gerado: Único e intransferível
          </div>
        </div>

        {/* BOTÃO DE PITCH (Simula o sistema do Stand de Brindes) */}
        <button
          onClick={() => onConfirmarResgate(custoPremio)}
          className="mt-8 bg-[#1A1613] text-white border-2 border-white rounded-2xl p-4 font-black shadow-[4px_4px_0px_0px_white] hover:translate-y-1 hover:shadow-none transition-all w-full"
        >
          👨‍💼 Simular "Bipe" do Atendente (Reduzir -100pts)
        </button>

        <div className="mt-6 bg-[#FFB800] border-2 border-[#1A1613] rounded-3xl p-4 shadow-[4px_4px_0px_0px_#1A1613] flex flex-col gap-3 text-center">
          <p className="text-sm font-black text-[#1A1613] leading-tight">
            📍 Stand Oficial ao lado do Palco Luiz Gonzaga
          </p>
        </div>
      </div>
    </div>
  );
}
